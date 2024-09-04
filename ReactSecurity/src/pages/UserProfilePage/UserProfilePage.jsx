import { css } from '@emotion/react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { storage } from '../../firebase/firebase';
import { v4 as uuid } from 'uuid';
import "react-sweet-progress/lib/style.css";
import { Progress } from 'react-sweet-progress';
import { updateProfileImgApi } from '../../apis/userApi';
/** @jsxImportSource @emotion/react */

const layout = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 100px auto;
	width: 1000px;
`;

const imgBox = css`
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	width: 300px;
	height: 300px;
	box-shadow: 0px 0px 2px #00000088;
	cursor: pointer;
	overflow: hidden;

	& > img {
		width: 100%;
	}
`;

const progressBox = css`
	padding-top: 20px;
	width: 300px;
	padding-left: 35px;
`;

function UserProfilePage(props) {
	const queryClient = useQueryClient();
	const userInfoState = queryClient.getQueryState("userInfoQuery"); // 회원정보 확인을 위해서
	const [ uploadPercent, setUploadPercent ] = useState(0);

	const handleImageChangeOnClick = () => {
		if(window.confirm("프로필 사진을 변경하시겠습니까?")) {
			const fileInput = document.createElement("input");
			fileInput.setAttribute("type", "file");
			fileInput.setAttribute("accept", "image/*");
			fileInput.click();
			
			fileInput.onchange = (e) => {
				const files = Array.from(e.target.files);
				const profileImage = files[0];
				setUploadPercent(0);
				const storageRef = ref(storage, `user/profile/${uuid()}_${profileImage.name}`);
				const uploadTask = uploadBytesResumable(storageRef, profileImage); // storageRef경로에 profileImage업로드
				uploadTask.on(
					"state_changed",
					(snapshot) => {
						setUploadPercent(
							Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
						);
					},
					(error) => {
						console.log(error);
					},
					async (success) => {
						const url = await getDownloadURL(storageRef);
						const response = await updateProfileImgApi(url);
						queryClient.invalidateQueries(["userInfoQuery"]); // 쿼리가 만료되면 알아서 다시 가져옴
					} 
				);
			}		
		}
	}

	const handleChangeDefaultImg = async () => {
		if(window.confirm("기본이미지로 변경하시겠습니까?")) {
			await updateProfileImgApi("");
			queryClient.invalidateQueries(["userInfoQuery"]);
		}
	}

	return (	
		<div css={layout}>
			<h1>프로필</h1>	
			<div css={imgBox} onClick={handleImageChangeOnClick}>
				<img src={userInfoState?.data?.data.img} alt="" />
			</div>
			<div css={progressBox}>
				<Progress percent={uploadPercent} status={uploadPercent !== 100 ? "active" : "success"} />
			</div>
			<div>
				<button onClick={handleChangeDefaultImg}>기본 이미지로 변경</button>
			</div>
		</div>			
	);
}

export default UserProfilePage;