import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage/IndexPage";
import UserJoinPage from "./pages/UserJoinPage/UserJoinPage";
import UserLoginPage from "./pages/UserLoginPage/UserLoginPage";
import { instance } from "./apis/util/instance";
import { useQuery } from "react-query";

function App() {

    const accessTokenValid = useQuery( // 키 - 요청 메서드 - 옵션
        ["accessTokenValidQuery"],
        async () => {
            console.log("쿼리에서 요청!!!");
            return await instance.get("/auth/access", { // accessToken이 유효한지 검증 요청
                params: {
                    accessToken: localStorage.getItem("accessToken")
                }
            });
        }, {   
            retry: 0,            
            onSuccess: response => { // return 값을 response
                console.log("OK응답");
                console.log(response);
            },
            onError: error => {
                console.log("오류!");
                console.error(error);
            }
        }
    );

    const userInfo = useQuery(
        ["userInfoQuery"],
        async () => {
            return await instance.get("/user/me");
        },
        {
            enabled: accessTokenValid.isSuccess && accessTokenValid.data?.data, // 토큰이 유효하면 요청을 날림
            onSuccess: response => {
                console.log(response);
            },
            onError: error => { // 토큰이 유효하지 않으면

            }
        }
    );

    console.log(accessTokenValid);

    console.log("그냥 출력");
    console.log(accessTokenValid.data);

    // useEffect(() => {
    //     // const accessToken = localStorage.getItem("accessToken");
    //     // if(!!accessToken) {
    //     //     setRefresh(true);
    //     // }
    //     console.log("Effect!!!");
    // }, [accessTokenValid.data]);

    return (
        <BrowserRouter>            
            <Routes>
                <Route path="/" element={<IndexPage />} />
                <Route path="/user/join" element={<UserJoinPage />} />
                <Route path="/user/login" element={<UserLoginPage />} />
                <Route path="/admin/*" element={<></>} />

                <Route path="/admin/*" element={<h1>Not Found</h1>} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>               
      </BrowserRouter>
    );
}

export default App;
