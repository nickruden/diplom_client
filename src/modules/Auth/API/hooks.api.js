import { useMutation } from "@tanstack/react-query";
import { loginUser, registerUser } from "../../../common/API/services/auth/endpoints";
import { useDispatch } from "react-redux";
import { userAuth } from "../../../common/store/slices/user.slice";
import { setAuthTokens } from "../../../common/utils/MyStorage/tokens/setAuthTokens";
import { useNavigate } from "react-router-dom";

export const useLoginUser = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    return useMutation({
        mutationFn: (data) => loginUser(data),
        onSuccess: (data) => {
            setAuthTokens(data.accessToken, data.refreshToken)
            const flag = true;
            const id = data.id;
            dispatch(userAuth({id, flag}));
            navigate('/');
        },
        onError: (err) => {
            return err.response?.data?.message;
        },
    })
};

export const useRegisterUser = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log(1)
    return useMutation({
        mutationFn: (data) => registerUser(data),
        onSuccess: (data) => {
            console.log(data)
            setAuthTokens(data.accessToken, data.refreshToken)
            const flag = true;
            const id = data.id;
            dispatch(userAuth({id, flag}));
            navigate('/');
        },
        onError: (err) => {
            return err.response?.data?.message;
        },
    })
};
