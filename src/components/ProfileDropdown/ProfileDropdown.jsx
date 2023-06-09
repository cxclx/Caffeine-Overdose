import React, { useState, useEffect } from "react";
import styles from "./ProfileDropdown.module.scss";
import Placeholder from "./../../assets/images/avatar.png";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc } from "firebase/firestore";
import { doc, getFirestore } from "firebase/firestore";
import { auth } from "./../../firebase";

function ProfileDropdown() {
  const [user] = useAuthState(auth);
  const [imageUrl, setImageUrl] = useState(
    localStorage.getItem("profileImage") || null
  );
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.removeItem("profileImage");
        navigate("/redirect", { state: { action: "Logged Out" } });
      })
      .catch((error) => {
        console.error(error.message);
      });
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          if (userData.profileImage) {
            setImageUrl(userData.profileImage);
            localStorage.setItem("profileImage", userData.profileImage);
          }
          if (userData.username) {
            setUsername(userData.username);
          }
        }
      }
    };

    fetchProfileData();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.ProfileDropdown}`)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.ProfileDropdown}>
      <div className={styles.Img__container}>
        <img
          src={imageUrl || Placeholder}
          onClick={toggleDropdown}
          className={styles.DropdownButton}
          alt="Avatar"
        />
      </div>
      {isOpen && (
        <ul className={styles.DropdownList}>
          <li className={styles.DropdownItem}>
            {username}
          </li>
          <Link to="/profile" onClick={toggleDropdown}>
            <li className={styles.DropdownItem}>Profile</li>
          </Link>
          <span></span>
          <li className={styles.DropdownItem} onClick={handleLogout}>
            Logout
          </li>
        </ul>
      )}
    </div>
  );
}

export default ProfileDropdown;
