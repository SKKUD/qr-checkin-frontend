import { useEffect, useState, useContext } from 'react';
import { Container } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import styled from '@emotion/styled';
import { QrReader } from '@blackbox-vision/react-qr-reader';
import CropFreeIcon from '@mui/icons-material/CropFree';
import ButtonAppBar from '../components/common/ButtonAppBar';
import StickyFooter from '../components/common/StickyFooter';

const Position1 = styled(Container)`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
`;

const MainDiv = styled(Container)`
	margin: 0 !important;
	padding: 0 !important;
	max-width: none !important;
	min-height: 100vh !important;
	display: flex;
	flex-direction: column;
	flex-grow: 0;
`;

const ViewFinder = () => (
	<>
		<svg
			width="100%"
			viewBox="0 0 100 100"
			style={{
				top: 0,
				left: 0,
				zIndex: 1,
				boxSizing: 'border-box',
				border: '50vh solid rgba(0, 0, 0, 0.3)',
				position: 'absolute',
				width: '100%',
				height: '100%',
			}}
		>
			<path
				fill="none"
				d="M013,0 L0,0 L0,13"
				stroke="rgba(255, 0, 0, 0.5)"
				strokeWidth="5"
			/>
			<path
				fill="none"
				d="M0,87 L0,100 L13,100"
				stroke="rgba(255, 0, 0, 0.5)"
				strokeWidth="5"
			/>
			<path
				fill="none"
				d="M87,100 L100,100 L100,87"
				stroke="rgba(255, 0, 0, 0.5)"
				strokeWidth="5"
			/>
			<path
				fill="none"
				d="M100,13 L100,0 87,0"
				stroke="rgba(255, 0, 0, 0.5)"
				strokeWidth="5"
			/>
		</svg>
	</>
);

export default function QRReader() {

	const delay = 1000;

	const [lastResult, setLastResult] = useState(null);
	const [isLoading, setIsLoading] = useState(false);


	const handleScan = (result, error) => {
		if (lastResult === result?.text) {
			return;
		}

		if (!!result) {
			setLastResult(result?.text);
			console.log(result?.text);
			fetch(`${process.env.REACT_APP_API_URL}/presentation/qr?studentId=${result?.text}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
			})
		}

		if (!!error) {
			console.info(error);
		}
	};

	return (
		<MainDiv>
			<ButtonAppBar />

			<div id="qr-reader">
				<QrReader
					scanDelay={delay}
					onResult={handleScan}
					ViewFinder={ViewFinder}
					constraints={{ facingMode: 'user' }}
				/>
			</div>
			<StickyFooter />
		</MainDiv>
	);
}
