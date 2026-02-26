export const createActivityTracker = () => {
  let lastSeenAt = Date.now();
  let lastDataActivityAt = Date.now();

  const markSeen = () => {
    lastSeenAt = Date.now();
  };

  const markDataActivity = () => {
    const now = Date.now();
    lastSeenAt = now;
    lastDataActivityAt = now;
  };

  const getLastSeenAt = () => lastSeenAt;
  const getLastDataActivityAt = () => lastDataActivityAt;

  return { markSeen, markDataActivity, getLastSeenAt, getLastDataActivityAt };
};

export type ActivityTracker = ReturnType<typeof createActivityTracker>;