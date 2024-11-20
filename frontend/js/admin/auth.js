import Config from "../config.js";

export async function postForgotPassword(formData) {
    try {
        const response = await fetch(`${Config.BACKEND_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            await response.json();
            alert('A Reset Password Link has shared successfully on your registered email!')
            setTimeout(() => {
                window.location.href = "sign-in.html";
            }, 2000);
        }

    } catch (err) {
        console.error(err);
    }
}
