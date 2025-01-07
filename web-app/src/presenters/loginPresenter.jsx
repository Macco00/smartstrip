import LoginView from "/src/views/loginView.jsx";
import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { auth } from "/src/firebaseModel.js";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
const provider = new GoogleAuthProvider();

export default observer(function Login(props) {
  const navigate = useNavigate();

  function signIn() {
    signInWithPopup(auth, provider)
      .then((result) => {
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error signing in");
      });
  }
  return <LoginView authUser={signIn} user={props.model.currentUser} />;
});
