type userInfo = {
  name: string;
  email: string;
  _id: string;
  pic: string;
  createdAt: string;
  updatedAt: string;
};
type user = {
  name: string;
  email: string;
  _id: string;
  pic: string;
};

export const exceptSender = (loggedinuser: user, users: Array<userInfo>) => {
  return users[0]._id === loggedinuser._id ? users[1] : users[0];
};

// This will take the array of users in Group chat and removes user from that array
