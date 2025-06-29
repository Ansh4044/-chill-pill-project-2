const fetch = require("node-fetch");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { fileName, fileContent } = JSON.parse(event.body);
  const token = process.env.GITHUB_TOKEN;
  const apiUrl = `https://api.github.com/repos/Ansh4044/-chill-pill-project-2/contents/songs/${fileName}`;

  const res = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "netlify-function"
    },
    body: JSON.stringify({
      message: `Upload ${fileName}`,
      content: fileContent
    })
  });

  const data = await res.json();
  if (!res.ok) {
    return {
      statusCode: res.status,
      body: JSON.stringify({ message: "Upload failed", error: data.message })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Upload successful", url: data.content.download_url })
  };
};
