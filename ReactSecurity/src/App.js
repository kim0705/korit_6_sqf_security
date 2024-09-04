import "./App.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import UserJoinPage from "./pages/UserJoinPage/UserJoinPage";
import IndexPage from "./pages/IndexPage/IndexPage";
import UserLoginPage from "./pages/UserLoginPage/UserLoginPage";
import { instance } from "./apis/util/instance";
import { useQuery } from "react-query";
import UserProfilePage from "./pages/UserProfilePage/UserProfilePage";
import { useEffect, useState } from "react";
import OAuth2JoinPage from "./pages/OAuth2JoinPage/OAuth2JoinPage";
import OAuth2LoginPage from "./pages/OAuth2LoginPage/OAuth2LoginPage";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authRefresh, setAuthRefresh] = useState(true);
  /**
   * 페이지 이동시 Auth(로그인, 토큰) 확인
   * 1. index(home) 페이지를 먼저 들어가서 로그인 화면으로 이동한 경우 -> index로 이동
   * 2. 탭을 열자마자 주소창에 수동입력을 통해 로그인 페이지로 이동한 경우 -> index로 이동
   * 3. 로그인 후 사용 가능한 페이지로 들어갔을 때 로그인 페이지로 이동한 경우 -> 이전 페이지로 이동
   * 4. 로그인이 된 상태 -> 어느 페이지든 이동
   */

  useEffect(() => {
    // 마운트시 실행
    if (!authRefresh) {
      setAuthRefresh(true); // 페이지가 변경될 때 마다 토큰 검사
    }
  }, [location.pathname]);

  const accessTokenValid = useQuery(
    // 키 - 요청 메서드 - 옵션
    ["accessTokenValidQuery"],
    async () => {
      setAuthRefresh(false);
      console.log("쿼리에서 요청!!!");
      return await instance.get("/auth/access", {
        // accessToken이 유효한지 검증 요청
        params: {
          accessToken: localStorage.getItem("accessToken"),
        },
      });
    },
    {
      enabled: authRefresh,
      retry: 0,
      refetchOnWindowFocus: false,
      onSuccess: (response) => {
        const permitAllPaths = ["/user"];
        for (let permitAllPath of permitAllPaths) {
          if (location.pathname.startsWith(permitAllPath)) {
            navigate(-1);
            break;
          }
        }
      },
      onError: (error) => {
        const authPaths = ["/profile"];
        for (let authPath of authPaths) {
          if (location.pathname.startsWith(authPath)) {
            navigate("/user/login");
            break;
          }
        }
      },
    }
  );

  const userInfo = useQuery(
    ["userInfoQuery"],
    async () => {
      return await instance.get("/user/me");
    },
    {
      enabled: accessTokenValid.isSuccess && accessTokenValid.data?.data, // 토큰이 유효하면 요청을 날림
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Routes>
      <Route path="/" element={<IndexPage />} />
      <Route path="/user/join" element={<UserJoinPage />} />
      <Route path="/user/join/oauth2" element={<OAuth2JoinPage />} />
      <Route path="/user/login" element={<UserLoginPage />} />
      <Route path="/user/login/oauth2" element={<OAuth2LoginPage />} />
      <Route path="/admin/*" element={<></>} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/admin/*" element={<></>} />
      <Route path="/admin/*" element={<h1>Not Found</h1>} />
      <Route path="*" element={<h1>Not Found</h1>} />
    </Routes>
  );
}

export default App;
