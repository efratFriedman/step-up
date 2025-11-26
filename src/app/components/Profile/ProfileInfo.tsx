"use client";
import { useState } from "react";
import styles from "./ProfileInfo.module.css";
import { isValidPhone, isValidBirthDate, isValidPassword } from "@/services/server/validationService";
import { FaCamera } from "react-icons/fa";
import { uploadImageToCloudinary } from "@/services/server/cloudinaryService";
import { updateUserService } from "@/services/client/userService";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/app/store/useUserStore";

interface IUserFront {
    id: string;
    name: string;
    email: string;
    phone?: string;
    birthDate?: string;
    profileImg?: string;
}

export default function ProfileInfo() {
    const user = useUserStore((state) => state.user);
    const setUser = useUserStore((state) => state.setUser);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ phone?: string; birthDate?: string; password?: string }>({});
    const router = useRouter();


    if (!user) return <p>Loading...</p>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!user || !e.target.files?.[0]) return;

        setLoading(true);
        try {
            const uploadedUrl = await uploadImageToCloudinary(e.target.files[0]);
            setUser({ ...user, profileImg: uploadedUrl });
        } catch (err) {
            console.error(err);
            alert("Image upload failed");
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!user) return;

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

        const confirmUpdate = window.confirm(
            `You're about to update your profile:\n
Name: ${user.name}\n
Email: ${user.email}\n
Phone: ${user.phone ?? "(empty)"}\n
Birthdate: ${user.birthDate}\n
Do you want to save these changes?`
        );

        if (!confirmUpdate) return;

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

            alert("Profile updated!");
            router.push("/home");

        } catch (err) {
            console.error(err);
            alert("Update failed");
        }

        setLoading(false);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>My Profile</h1>

            <div className={styles.profileImgWrapper}>
                {user.profileImg && <img src={user.profileImg} className={styles.profileImg} alt="profile" />}
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

            <label>Name</label>
            <input className={styles.input} name="name" value={user.name} onChange={handleChange} disabled={loading} />

            <label>Email</label>
            <input className={`${styles.input} ${styles.readOnly}`} name="email" value={user.email} readOnly />

            <label>Phone</label>
            <input className={styles.input} name="phone" value={user.phone ?? ""} onChange={handleChange} disabled={loading} />
            {errors.phone && <p className={styles.error}>{errors.phone}</p>}

            <label>Birthdate</label>
            <input className={styles.input} type="date" name="birthDate" value={user.birthDate ?? ""} onChange={handleChange} disabled={loading} />
            {errors.birthDate && <p className={styles.error}>{errors.birthDate}</p>}


            <button className={styles.saveBtn} onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}
