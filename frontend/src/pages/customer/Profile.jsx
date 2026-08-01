import { useEffect, useState } from "react";

const Profile = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    const [profile, setProfile] = useState(null);
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");

    // Load profile from the backend
    const loadProfile = () => {

        fetch(
            `http://localhost/EventEase/backend/api/profile.php?user_id=${user.id}`
        )
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                setProfile(data.user);
                setFullName(data.user.full_name);
                setPhone(data.user.phone);

            }

        });

    };

    // Load profile when page opens
    useEffect(() => {

        loadProfile();

    }, []);

    // Update profile
    const updateProfile = () => {

        fetch(
            "http://localhost/EventEase/backend/api/update_profile.php",
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    user_id: user.id,
                    full_name: fullName,
                    phone: phone

                })

            }
        )
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                setMessage("✅ Profile updated successfully!");

                // Reload latest data
                loadProfile();

            } else {

                setMessage("❌ Failed to update profile.");

            }

        });

    };

    if (!profile) {

        return (

            <div className="p-10">

                Loading Profile...

            </div>

        );

    }

    return (

        <div
            className="
                min-h-screen
                bg-gray-100
                flex
                justify-center
                items-center
                p-8
            "
        >

            <div
                className="
                    bg-white
                    shadow-xl
                    rounded-3xl
                    p-10
                    w-full
                    max-w-2xl
                "
            >

                <h1
                    className="
                        text-3xl
                        font-bold
                        text-center
                        mb-8
                        text-purple-700
                    "
                >
                    My Profile
                </h1>

                {message && (

                    <div
                        className="
                            bg-green-100
                            border
                            border-green-400
                            text-green-700
                            px-4
                            py-3
                            rounded-lg
                            mb-6
                        "
                    >
                        {message}
                    </div>

                )}

                <div className="space-y-5">

                    <div>

                        <p className="text-gray-500 mb-2">
                            Full Name
                        </p>

                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) =>
                                setFullName(e.target.value)
                            }
                            className="
                                w-full
                                border
                                rounded-lg
                                p-3
                                focus:outline-none
                                focus:ring-2
                                focus:ring-purple-500
                            "
                        />

                    </div>

                    <div>

                        <p className="text-gray-500">
                            Email
                        </p>

                        <h2 className="text-xl">
                            {profile.email}
                        </h2>

                    </div>

                    <div>

                        <p className="text-gray-500 mb-2">
                            Phone Number
                        </p>

                        <input
                            type="text"
                            value={phone}
                            onChange={(e) =>
                                setPhone(e.target.value)
                            }
                            className="
                                w-full
                                border
                                rounded-lg
                                p-3
                                focus:outline-none
                                focus:ring-2
                                focus:ring-purple-500
                            "
                        />

                    </div>

                    <div>

                        <p className="text-gray-500">
                            Role
                        </p>

                        <h2 className="text-xl capitalize">
                            {profile.role}
                        </h2>

                    </div>

                    <div>

                        <p className="text-gray-500">
                            Member Since
                        </p>

                        <h2 className="text-xl">
                            {profile.created_at}
                        </h2>

                    </div>

                </div>

                <div className="mt-8">

                    <button
                        onClick={updateProfile}
                        className="
                            w-full
                            bg-purple-600
                            hover:bg-purple-700
                            text-white
                            py-3
                            rounded-xl
                            transition
                            font-semibold
                        "
                    >
                        Save Changes
                    </button>

                </div>

            </div>

        </div>

    );

};

export default Profile;