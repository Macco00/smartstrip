import GoogleSignInButton from "./GoogleSignInButton";

export default function loginView(props) {
  function authClickACB() {
    props.authUser();
  }

  return (
    <div>
      <div
        className="max-w-xl mx-auto bg-ss-sidebar shadow-md rounded-md p-10"
        style={{ marginTop: "100px" }}
      >
        <h1 className="text-4xl text-white font-bold mb-6 text-center">
          Welcome to SmartStrip!
        </h1>
        <p className="text-white  mb-6 text-center">
          From the SmartStrip Hub, you can remotely customize and control your
          SmartStrip LED lightstrip with ease. Seamlessly integrate with your
          smart home, stay informed with real-time updates, and elevate your
          lighting experience effortlessly.{" "}
        </p>
        <div className="flex justify-center mb-4">
          <GoogleSignInButton onClick={authClickACB} />
        </div>
      </div>
    </div>
  );
}
