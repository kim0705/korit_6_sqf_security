import React from 'react';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { useQueryClient } from 'react-query';

const layout = css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 100px 300px;
`;

const header = css`
    display: flex;
    justify-content: center;
    margin-bottom: 40px;

    & > input {
        box-sizing: border-box;
        width: 50%;
        height: 40px;
        border-radius: 50px;
        padding: 10px 20px;
    }
`;

const main = css`
    display: flex;
    justify-content: space-between;
`;

const leftBox = css`
    box-sizing: border-box;
    border: 2px solid #dbdbdb;
    border-radius: 10px;
    width: 64%;
`;

const rightBox = css`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid #dbdbdb;
    border-radius: 10px;
    width: 35%;
    padding: 20px;

    & > button {
        margin-bottom: 10px;
        width: 100%;
        height: 40px;
        font-size: 15px;
        font-weight: 600;
    }

    & > div {
        display: flex;
        justify-content: center;
        width: 100%;

        & > a:not(:nth-last-of-type(1))::after {
            display: inline-block;
            content: "";
            margin: 0px 5px;
            height: 60%;
            border-left: 1px solid #222222;
        }
    }
`;

function IndexPage(props) {
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData("accessTokenValidQuery");
    console.log(data);

    return (
        <div css={layout}>
            <header css={header}>
                <input type="search" placeholder='검색어를 입력해 주세요' />
            </header>
            <main css={main}>
                <div css={leftBox}></div>
                <div css={rightBox}>
                    <p>더 안전하고 편리하게 이용하세요</p>
                    <button>로그인</button>
                    <div>
                        <Link to={"/user/help/id"}>아이디 찾기</Link>
                        <Link to={"/user/help/pw"}>비밀번호 찾기</Link>
                        <Link to={"/user/help/join"}>회원가입</Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default IndexPage;