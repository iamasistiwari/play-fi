"use server"



export async function refreshSpotifyToken(accessToken: string){
    const params = new URLSearchParams()
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", accessToken);

    try {
        
        const response = await fetch(`https://accounts.spotify.com/api/token"`, {
          method: "POST",
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(
                process.env.SPOTIFY_CLIENT! + ":" + process.env.SPOTIFY_SECRET!,
              ).toString("base64"),
          },
          body: params,
        });
        const data = await response.json()
        console.log("HERE IS RESPONSE", data)
    } catch (error) {
        console.log("ERROR FOUND", error)
    }
}