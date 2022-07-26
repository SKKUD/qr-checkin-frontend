import { useEffect, useState, useContext, useRef } from 'react';
import styled from '@emotion/styled';
import { SocketContext } from '../context/socket';
import sound from '../1-hour-of-silence.mp3';

const MainContainer = styled.div`
	height: 100vh;
	background-color: #001327;
	color: white;
	display: flex;
	flex-direction: column;
	align-items: center;
	align-content: center;
	justify-content: center;
	position: relative;

	&::before {
		content: '';
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
		opacity: 0.1;
		//use background image
		background-image: url('/Emblem.png');
		background-repeat: no-repeat;
		background-size: 700px;
		background-position: center;
	}
`;

const Name = styled.h1`
	font-size: 10rem;
	font-weight: bolder;
	letter-spacing: 0.4rem;
	z-index: 2;
	margin-top: 0;
	margin-bottom: 0;
	letter-spacing: 2.5rem;
	text-align: center;
`;

const Major = styled.h2`
	font-size: 5rem;
	letter-spacing: 0.5rem;
	font-weight: 600;
	z-index: 2;
	margin-top: 0;
	margin-bottom: 0;
	padding-bottom: 0;
	letter-spacing: 2.5rem;
	text-align: center;
`;

const Degree = styled.h3`
	font-size: 4rem;
	letter-spacing: 0.5rem;
	z-index: 2;
	margin-bottom: 0;
	padding-bottom: 0;
	text-align: center;
`;

export default function Presentation() {
	const [data, setData] = useState({
		dataValues: {
			name: '',
			major: '',
			comment: '',
		},
	});
	const [connect, setConnect] = useState(true);
	const [audioBtn, setAudioBtn] = useState(false);
	const [audioSrc, setAudioSrc] = useState(sound);

	const AudioButton = styled.button`
		z-index: 2;
		display: ${audioBtn ? 'none' : '#1f321c'};
	`;

	const AudioComponent = styled.audio``;

	const socket = useContext(SocketContext);

	const buttonRef = useRef(null);

	const playSound = async (bufferData) => {
		const context = new AudioContext();
		const buffer = await context.decodeAudioData(bufferData);
		const source = context.createBufferSource();
		source.buffer = buffer;
		source.connect(context.destination);
		source.start();
	};

	const audioSet = () => {
		setAudioBtn(true);
		console.log('clicked');
		if (buttonRef.current) {
			buttonRef.current.play();
		}
	};

	useEffect(() => {
		// on socket connect, set connect to true
		socket.on('connect', () => {
			setConnect(true);
		});

		socket.on('display', (socketData) => {
			//Delete console log for production
			console.log(socketData);
			setData(socketData.data);
			playSound(socketData.voiceTTS.audioContent);
		});

		return () => {
			socket.off('connect');
			socket.off('display');
		};
	}, [socket]);

	return (
		<MainContainer>
			<>
				<AudioButton
					onClick={() => {
						audioSet();
					}}
				>
					Play
				</AudioButton>
				<AudioComponent ref={buttonRef}>
					<source src={audioSrc} />
				</AudioComponent>
			</>
			{connect ? (
				<>
					<Name>{data?.dataValues.name}</Name>
					<Major>{data?.dataValues.major}</Major>
					<Degree>{data?.dataValues.comment}</Degree>
				</>
			) : (
				<h1>Not Connected</h1>
			)}
		</MainContainer>
	);
}
