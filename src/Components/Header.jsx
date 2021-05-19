import React from "react";

function Header(props) {
  const firebase = props.firebase;
  //logs you out
  function handleLogOut() {
    firebase.auth().signOut();
    props.setIsLoggedIn(false);
  }

  return (
    <div className="container-fluid bg-dark d-flex box-shadow header-inside">
      <h1 className="inside ">Summer Storage</h1>
      <button
        onClick={() => {
          handleLogOut();
        }}
        className="btn btn-warning inside"
        type="button"
      >
        Logout
      </button>
    </div>
  );
}

export default Header;
