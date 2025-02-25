import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from '../firebase';

export function useUserAuth() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/Home");
    }
  }, [user, navigate]);
}

