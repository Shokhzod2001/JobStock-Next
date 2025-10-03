import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, Menu, MenuItem } from '@mui/material';
import { format } from 'date-fns';
import { useReactiveVar } from '@apollo/client';
import { socketVar, userVar } from '../../../apollo/store';
import ScrollableFeed from 'react-scrollable-feed';
import { useSwipeable } from 'react-swipeable';

interface Notification {
	id: string;
	title: string;
	desc?: string;
	type: string;
	status: string;
	createdAt: Date;
}

const NotificationItem = ({ notification, onRead }: { notification: Notification; onRead: () => void }) => {
	const handlers = useSwipeable({
		onSwipedRight: () => {
			if (notification.status === 'WAIT') {
				onRead();
			}
		},
		trackMouse: true,
	});

	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'LIKE':
				return '❤️';
			case 'COMMENT':
				return '💬';
			default:
				return '📢';
		}
	};

	return (
		<div {...handlers}>
			<MenuItem
				sx={{
					py: 2,
					px: 3,
					borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
					backgroundColor: notification.status === 'WAIT' ? 'rgba(64, 95, 242, 0.05)' : 'transparent',
					'&:hover': {
						backgroundColor: 'rgba(64, 95, 242, 0.1)',
					},
					position: 'relative',
					transition: 'all 0.3s ease',
				}}
			>
				<Stack spacing={1} sx={{ width: '100%' }}>
					<Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<Typography variant="body2" sx={{ fontSize: '20px' }}>
							{getNotificationIcon(notification.type)}
						</Typography>
						<Stack sx={{ flex: 1 }}>
							<Typography variant="body1" sx={{ fontWeight: 500 }}>
								{notification.title}
							</Typography>
							{notification.desc && (
								<Typography variant="body2" color="text.secondary">
									{notification.desc}
								</Typography>
							)}
						</Stack>
					</Box>
					<Typography variant="caption" color="text.secondary">
						{format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
					</Typography>
				</Stack>
			</MenuItem>
		</div>
	);
};

const NotificationModal = ({
	anchorEl,
	open,
	onClose,
	onUnreadCountChange,
}: {
	anchorEl: HTMLElement | null;
	open: boolean;
	onClose: () => void;
	onUnreadCountChange?: (count: number) => void;
}) => {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const socket = useReactiveVar(socketVar);
	const user = useReactiveVar(userVar);

	console.log('NotificationModal: Rendering with state:', {
		notificationsCount: notifications.length,
		unreadCount,
		isOpen: open,
		hasAnchorEl: !!anchorEl,
		socketReady: socket?.readyState === WebSocket.OPEN,
		userId: user?._id,
	});

	// Update parent component with unread count
	useEffect(() => {
		onUnreadCountChange?.(unreadCount);
	}, [unreadCount, onUnreadCountChange]);

	// Fetch notifications when modal opens
	useEffect(() => {
		if (open && user?._id) {
			console.log('NotificationModal: Modal opened, fetching notifications');

			if (socket?.readyState === WebSocket.OPEN) {
				socket.send(JSON.stringify({ event: 'get_notifications' }));
			} else {
				console.error('NotificationModal: Socket not ready to request notifications');
			}
		}
	}, [open, user?._id, socket]);

	// Mark notifications as read when modal opens
	useEffect(() => {
		if (open && notifications.length > 0 && socket?.readyState === WebSocket.OPEN) {
			console.log('NotificationModal: Marking notifications as read');

			const unreadNotificationIds = notifications.filter((n) => n.status === 'WAIT').map((n) => n.id);

			if (unreadNotificationIds.length > 0) {
				console.log('Sending markNotificationsAsRead with IDs:', unreadNotificationIds);
				socket.send(
					JSON.stringify({
						event: 'markNotificationsAsRead',
						data: unreadNotificationIds,
					}),
				);
			}
		}
	}, [open, notifications, socket]);

	// FIXED: Use addEventListener instead of onmessage
	useEffect(() => {
		if (!socket || !user?._id) return;

		const handleMessage = (event: MessageEvent) => {
			try {
				const data = JSON.parse(event.data);
				console.log('NotificationModal: Received websocket message:', data);

				// Only handle notification-related events
				if (data.event === 'notification') {
					const notification = data.payload;
					setNotifications((prev) => {
						const isDuplicate = prev.some((n) => n.id === notification.id);
						if (isDuplicate) return prev;

						const newNotifications = [notification, ...prev];
						setUnreadCount(newNotifications.filter((n) => n.status === 'WAIT').length);
						return newNotifications;
					});
				} else if (data.event === 'notifications_list') {
					console.log('NotificationModal: Received notifications list:', data.data);
					setNotifications(data.data);
					setUnreadCount(data.data.length);
				} else if (data.event === 'notificationStatus') {
					console.log('NotificationModal: Received status update:', data.payload);
					const { id, status } = data.payload;

					setNotifications((prev) => {
						const updatedNotifications = prev.map((n) => (n.id === id ? { ...n, status } : n));
						setUnreadCount(updatedNotifications.filter((n) => n.status === 'WAIT').length);
						return updatedNotifications;
					});
				}
			} catch (error) {
				console.error('NotificationModal: Error processing notification:', error);
			}
		};

		// Use addEventListener so it doesn't overwrite Chat.tsx handler
		socket.addEventListener('message', handleMessage);

		return () => {
			socket.removeEventListener('message', handleMessage);
		};
	}, [socket, user]);

	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: '380px',
					maxHeight: '500px',
					borderRadius: '12px',
					boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',
					'&::-webkit-scrollbar': {
						width: '4px',
					},
					'&::-webkit-scrollbar-track': {
						background: '#f1f1f1',
					},
					'&::-webkit-scrollbar-thumb': {
						background: '#888',
						borderRadius: '4px',
					},
				},
			}}
		>
			<Box
				component="div"
				sx={{
					p: 2,
					borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Stack direction="row" alignItems="center" spacing={1}>
					<Typography variant="h6" sx={{ fontWeight: 600 }}>
						Notifications
					</Typography>
					{unreadCount > 0 && (
						<Typography variant="caption" color="primary">
							{unreadCount} unread
						</Typography>
					)}
				</Stack>
			</Box>
			{/*@ts-ignore*/}
			<ScrollableFeed>
				<Stack sx={{ maxHeight: '400px', overflow: 'auto' }}>
					{notifications.length === 0 ? (
						<Box component="div" sx={{ p: 3, textAlign: 'center' }}>
							<Typography color="text.secondary">No notifications yet</Typography>
						</Box>
					) : (
						notifications.map((notification) => (
							<NotificationItem key={notification.id} notification={notification} onRead={() => {}} />
						))
					)}
				</Stack>
			</ScrollableFeed>
		</Menu>
	);
};

export default NotificationModal;
