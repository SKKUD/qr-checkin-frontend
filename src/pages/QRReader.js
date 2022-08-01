import { useEffect, useState, useRef } from 'react';
import {
	Box,
	Container,
	CircularProgress,
	Card,
	Button,
	Modal,
	Fade,
	Backdrop,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import styled from '@emotion/styled';
import QrScanner from 'qr-scanner';
import io from 'socket.io-client';

import ButtonAppBar from '../components/common/ButtonAppBar';
import StickyFooter from '../components/common/StickyFooter';

const MainDiv = styled(Container)`
	margin: 0 !important;
	padding: 0 !important;
	max-width: none !important;
	min-height: 100vh !important;
	display: flex;
	flex-direction: column;
	flex-grow: 0;
`;

const InnerDiv = styled(Container)`
	display: flex;
	flex-direction: column;
	align-items: center;
	align-content: center;
	justify-content: center;
	height: 100%;
	margin: auto;
`;

const StyledScanner = styled.video``;

const socket = io.connect('http://localhost:8000', {
	withCredentials: true,
	extraHeaders: {
		'my-custom-header': 'abcd',
	},
});

export default function QRReader() {
	const ref = useRef(null);

	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);

	// For Socket
	const [isConnected, setIsConnected] = useState(socket.connected);
	const [name, setName] = useState(null);

	useEffect(() => {
		const videoElem = ref.current;

		// fetch(`/api/users/${id}`)
		//     .then(res => res.json())
		//     .then(data => {
		//         setUser(data);
		//         setLoading(false);
		//     });

		const qrScanner = new QrScanner(
			videoElem,
			(result) => {
				console.log(result.data);
				pauseScanner();
				// socket.emit('display', result);
			},
			{
				highlightScanRegion: true,
				highlightCodeOutline: true,
				maxScansPerSecond: 1,
			}
		);

		function pauseScanner() {
			// pause scanner for 2 seconds
			qrScanner.pause();
			setTimeout(() => {
				qrScanner.start();
			}, 2000);
		}

		qrScanner.start();

		socket.on('connect', () => {
			setIsConnected(true);
		});

		socket.on('display', (data) => console.log(data));

		socket.on('disconnect', () => {
			setIsConnected(false);
		});

		return () => {
			socket.off('connect');
			socket.off('disconnect');
			socket.off('display');
		};
	}, []);

	if (loading === true) {
		setTimeout(() => {
			console.log('fetch' + user);
			setLoading(false);
		}, 2000);
	}

	return (
		<MainDiv>
			<ButtonAppBar />

			<InnerDiv>
				{loading ? <CircularProgress /> : <></>}
				<StyledScanner ref={ref} />
			</InnerDiv>
			<StickyFooter />
		</MainDiv>
	);
}
