const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteCommentBtn = document.querySelectorAll("#deleteCommentBtn");

const handleDeleteComment = async (event) => {
  const commentId = event.target.dataset.id;
  const commentToDelete = event.target.parentNode;
  const response = await fetch(`/api/comments/${commentId}/delete`, {
    method: "DELETE",
  });

  if (response.status === 200) {
    commentToDelete.parentNode.removeChild(commentToDelete);
  }
};

const addComment = (text, newCommentId) => {
  const videoComments = document.querySelector(".video__comments ul");
  const pseudoComment = document.createElement("li");
  pseudoComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "👋🏻";
  span2.dataset.id = newCommentId;
  span2.addEventListener("click", handleDeleteComment);
  pseudoComment.appendChild(icon);
  pseudoComment.appendChild(span);
  pseudoComment.appendChild(span2);
  videoComments.prepend(pseudoComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") return;
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      //information about the request
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    //create a fake comment
    addComment(text, newCommentId);
  }
};

if (form) form.addEventListener("submit", handleSubmit);
if (deleteCommentBtn)
  deleteCommentBtn.forEach((btn) =>
    btn.addEventListener("click", handleDeleteComment)
  );
