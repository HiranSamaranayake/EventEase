import { useEffect, useState } from "react";

const Profile = () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [profile, setProfile] = useState(null);

    const [fullName, setFullName] = useState("");

    const [phone, setPhone] = useState("");

    useEffect(() => {

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

    }, []);

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

                {/* SAVE BUTTON */}

                <div className="mt-8">

                    <button
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