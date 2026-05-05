export const ERROR_MESSAGES = {
  GENERAL: {
    MISSING_FIELDS: "Missing required fields.",
    UNEXPECTED: "An unexpected error occurred.",
  },
  AUTH: {
    AUTHENTICATION: "Failed to authenticate user.",
    UNAUTHORIZED: "You must be logged in.",
    FORBIDDEN: "You are not allowed to perform this action.",
  },
  USERS: {
    FETCH: {
      SINGULAR: "Failed to fetch user.",
      PLURAL: "Failed to fetch users.",
      QUESTIONS: "Failed to fetch user question.",
      ANSWERED_QUESTIONS: "Failed to fetch user answered question.",
    },
    NOT_FOUND: "User not found.",
    UPDATE: "Failed to update user.",
  },
  QUESTIONS: {
    FETCH: {
      SINGULAR: "Failed to fetch question.",
      PLURAL: "Failed to fetch questions.",
      ANSWERS: "Failed to fetch question answers.",
    },
    CREATE: "Failed to create question.",
    NOT_FOUND: "Question not found.",
    NOT_OWNER: "You are not the question owner.",
  },
  ANSWERS: {
    CREATE: "Failed to create answer.",
    ACCEPT: "Failed to accept answer.",
    NOT_FOUND: "Answer not found.",
  },
  VOTES: {
    SUBMIT: "Failed to submit vote.",
  },
  FOLLOWS: {
    FOLLOW: "Failed to follow user.",
    UNFOLLOW: "Failed to unfollow user.",
    DUPLICATE: "You are already following this user.",
    SELF: "You cannot follow yourself.",
  },
  NOTIFICATIONS: {
    FETCH: "Failed to fetch notifications.",
    FETCH_COUNT: "Failed to fetch notifications count.",
    MARK_READ: "Failed to mark notifications as read.",
  },
};

export const SUCCESS_MESSAGES = {
  USERS: {
    UPDATE: "User updated successfully.",
  },
  QUESTIONS: {
    CREATE: "Question created successfully.",
  },
  ANSWERS: {
    CREATE: "Answer created successfully.",
    ACCEPT: "Answer accepted successfully.",
  },
  VOTES: {
    SUBMIT: "Vote submitted successfully.",
    UPDATE: "Vote updated successfully.",
    DELETE: "Vote delete successfully.",
  },
  FOLLOWS: {
    FOLLOW: "Followed successfully.",
    UNFOLLOW: "Unfollowed successfully.",
  },
  NOTIFICATIONS: {
    MARK_READ: "Notifications marked as read.",
  },
};
