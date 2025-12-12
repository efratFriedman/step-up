"use client";
import { useState, ChangeEvent } from "react";
import styles from "./ProfileInfo.module.css";
import { isValidPhone, isValidBirthDate } from "@/services/server/validationService";
import { FaCamera } from "react-icons/fa";
import { uploadImageToCloudinary } from "@/services/server/cloudinaryService";
import { updateUserService } from "@/services/client/userService";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";
import ConfirmModal from "@/app/components/Profile/ConfirmModel/ConfirmModal";
import toast from "react-hot-toast";
import { ROUTES } from "@/config/routes";

interface FormErrors {
  phone?: string;
  birthDate?: string;
}

export default function ProfileInfo() {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; birthDate?: string; password?: string }>({});
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();


  if (!user) return <p>Loading...</p>;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;

    setLoading(true);
    try {
      const uploadedUrl = await uploadImageToCloudinary(e.target.files[0]);
      setUser({ ...user, profileImg: uploadedUrl });
    } catch (err) {
      console.error(err);
      toast.error("Image upload failed");
    }
    setLoading(false);
  };

  const handleSaveClick = () => {
    const newErrors: typeof errors = {};

    if (!user.birthDate) newErrors.birthDate = "Birthdate is required";
    else if (!isValidBirthDate(user.birthDate)) newErrors.birthDate = "Invalid birthdate or user under 8 years old";

    if (!user.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!isValidPhone(user.phone)) {
      newErrors.phone = "Invalid Israeli phone number";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setShowModal(true);
  }

  const handleConfirmUpdate = async () => {
    if (!user) return;
    setShowModal(false);
    setLoading(true);

    try {
      const updateData = {
        name: user.name,
        phone: user.phone,
        birthDate: user.birthDate,
        profileImg: user.profileImg,
      };

      const updatedUser = await updateUserService(user.id, updateData);
      setUser({
        ...user,
        ...updatedUser,
      });
      router.push(ROUTES.HOME);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>My Profile</h1>

      <div className={styles.profileImgWrapper}>
        {user.profileImg ? (
          <img src={user.profileImg} className={styles.profileImg} alt="profile" />
        ) : (
          <div className={`${styles.profileImg} ${styles.placeholderImg}`} />
        )}

        <label className={styles.cameraIcon}>
          <FaCamera />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.hiddenFileInput}
            disabled={loading}
          />
        </label>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Name</label>
        <input
          className={styles.input}
          name="name"
          value={user.name || ""}
          onChange={handleChange}
          disabled={loading}
          placeholder="Your Full Name"
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Email</label>
        <input
          className={`${styles.input} ${styles.readOnly}`}
          name="email"
          value={user.email || ""}
          readOnly
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Phone</label>
        <input
          className={styles.input}
          name="phone"
          value={user.phone || ""}
          onChange={handleChange}
          disabled={loading}
          placeholder="050-0000000"
        />
        {errors.phone && <p className={styles.error}>{errors.phone}</p>}
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Birthdate</label>
        <input
          className={styles.input}
          type="date"
          name="birthDate"
          value={user.birthDate || ""}
          onChange={handleChange}
          disabled={loading}
        />
        {errors.birthDate && <p className={styles.error}>{errors.birthDate}</p>}
      </div>

      <button className={styles.saveBtn} onClick={handleSaveClick} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </button>

      {showModal && (
        <ConfirmModal
          title="Confirm Update"
          message={`You're about to update your profile:\nName: ${user.name}\nEmail: ${user.email}\nPhone: ${user.phone ?? "(empty)"}\nBirthdate: ${user.birthDate}`}
          onConfirm={handleConfirmUpdate}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
