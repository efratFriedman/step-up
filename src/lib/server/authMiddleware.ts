

export function extractToken(req:Request){
    const cookieHeader=req.headers.get("cookie");
    const token=cookieHeader
}