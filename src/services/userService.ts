export async function updateUserService(userId: string, updateData: any) {
    const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
    });

    if (!res.ok) throw new Error("Failed to update user");

    return res.json();
}