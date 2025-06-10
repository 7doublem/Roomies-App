import { StyleSheet } from 'react-native';
import MainScreen from 'screens/MainScreen';

export const styles = StyleSheet.create({
  // Sign in Screen
  signIn_Container: {
    padding: 16,
  },
  signIn_Touchable: {
    backgroundColor: '#4f8cff',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  signIn_Touchable_Text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signIn_Input: {
    fontSize: 16,
    padding: 12,
    color: '#222',
    backgroundColor: 'transparent',
  },
  signIn_Text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    textAlign: 'center',
    marginBottom: 20,
  },
  signIn_Googlebutton: {
    alignSelf: 'center',
    marginVertical: 12,
    width: 320,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffeead',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  signIn_Googlebutton_image: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  signIn_Googlebutton_text: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 20,
  },
  signIn_goBackButton: {
    alignSelf: 'center',
    marginVertical: 12,
    width: 320,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffcc5c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signIn_goBackButton_text: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 18,
  },

  // Sign Up Page
  signUp_container: { padding: 16 },
  signUp_text: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  signUp_Input: {
    borderWidth: 1,
    marginVertical: 8,
    padding: 12,
    fontSize: 18,
    borderRadius: 8,
  },
  signUp_touchable: {
    alignSelf: 'center',
    marginVertical: 12,
    width: 320,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffcc5c',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  signUp_touchable_text: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 20,
  },
  signUp_googleButton: {
    alignSelf: 'center',
    marginVertical: 12,
    width: 320,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffeead',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  signUp_googleButton_image: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  signUp_googleButton_text: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 20,
  },
  signUp_signinButton: {
    alignSelf: 'center',
    marginVertical: 12,
    width: 320,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#96ceb4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUp_signinButton_text: {
    color: '#111',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signUp_Avatar_Touchable: {
    marginBottom: 16,
  },
  signUp_Avatar_Touchable_image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#96ceb4',
    backgroundColor: '#fff',
    alignSelf: 'center',
  },
  signUp_Avatar_Touchable_text: {
    textAlign: 'center',
    fontSize: 18,
    color: '#111',
    marginTop: 8,
  },
  //Welcome Screen
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcomeTitle: {
    fontSize: 45,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 50,
    textAlign: 'center',
  },
  welcomeUserNameText: { fontSize: 20, color: 'ff6f69', marginVertical: 10 },
  welcomeText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  welcomeJoinText: { fontSize: 22, fontWeight: 'bold', marginVertical: 10 },
  welcomeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
  },

  welcomeInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    marginRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  welcomeJoinInButton: {
    backgroundColor: 'rgb(255, 111, 105)',
    overflow: 'hidden',
    elevation: 3,
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  welcomeJoinInButtontext: {
    borderRadius: 10,
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },

  welcomeCreateGroupButton: {
    backgroundColor: 'rgb(105 177 249)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    width: 320,
    alignSelf: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  welcomeCreateBtnText: {
    borderRadius: 10,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  },

  //Set Group
  SetGroup_container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },

  SetGroup_title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
  },

  SetGroup_input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    color: '#000',
  },

  SetGroup_Userinput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 15,
    color: '#000',
    flex: 1,
  },

  SetGroup_SearchText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 5,
    fontWeight: '500',
  },

  SetGroup_addUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },

  SetGroup_PlusIcon: { marginTop: -15, color: 'rgb(255, 111, 105) ' },
  SetGroup_userText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },

  SetGroup_userList: {
    flex: 1,
    marginBottom: 20,
  },
  SetGroup_userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
  },
  SetGroup_buttonWrapper: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },

  SetGroup_createGroupbtn: {
    backgroundColor: 'rgb(105 177 249)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  SetGroup_createGroupbtn_text: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  SetGroup_JoinGroupbtn: {
    backgroundColor: 'rgb(255, 111, 105)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginVertical: 10,
  },

  SetGroup_JoinGroupbtn_text: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },


  //Main Screen
  mainScreen_container: {},
  mainScreen_container_Text: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    // borderRadius: 20,
    opacity: 0.5,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    // backgroundColor: '#ff6f69',
    borderBottomColor: 'black',
    opacity: 1,
  },
  tabText: {
    fontWeight: 'bold',
    color: '#111',
    fontSize: 17,
  },

 //Chore Card
 card: {
  backgroundColor: '#fff',
  padding: 16,
  marginVertical: 5,
  marginHorizontal: 16,
  borderRadius: 12,
  elevation: 3,
  position: 'relative',
},
rewardBadge: {
  position: 'absolute',
  top: 10,
  right: 10,
  backgroundColor: '#ff6f69',
  paddingVertical: 4,
  paddingHorizontal: 8,
  borderRadius: 20,
},
rewardText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 14,
},
choreName: {
  fontSize: 19,
  fontWeight: 'bold',
  marginBottom: 8,
  color: '#111',
},
assignedTo: {
  fontSize: 15,
  marginBottom: 4,
  color: '#555',
},
countdown: {
  marginVertical: 5,
  fontSize: 15,
  color: '#888',
},
startdate: {
  marginVertical: 5,
  fontSize: 15,
  color: '#888',
},
card_Done: {
  backgroundColor: 'green',
},
card_Doing: {
  backgroundColor: 'yellow',
},
card_Todo: {
  backgroundColor: '#fff',
},

//Task Detail Screen
taskDetail_Screen_text: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
editBtn: { alignItems: 'flex-end' },

 //Comment Section
 commentSection: {
  marginTop: 20,
},
commentTitle: {
  fontWeight: 'bold',
  marginBottom: 10,
  fontSize: 23,
  alignSelf: 'center',
},
commentContainer: {
  flex: 1,
  padding: 10,
},
CommentBoxUser: {
  fontWeight: 'bold',
  marginBottom: 4,
},
CommentBoxUserText: {},
commentBox: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: '#f9f9f9',
  padding: 10,
  borderRadius: 8,
  marginBottom: 8,
},

deleteIconContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  paddingLeft: 10,
},

// Submit Comment

CommentInputWrapper: {
  flexDirection: 'row',
  gap: 10,
  alignItems: 'center',
},
CommentInput: {
  flex: 1,
  borderWidth: 1,
  backgroundColor: 'white',
  borderColor: 'white',
  paddingHorizontal: 10,
  paddingVertical: 8,
  borderRadius: 8,
},
CommentInputFocused: {
  backgroundColor: 'white',
},
CommentSubmitButton: {
  backgroundColor: 'rgb(255, 111, 105)',
  paddingVertical: 12,
  paddingHorizontal: 25,
  borderRadius: 6,
  alignItems: 'center',
},
CommentSubmitButtonText: {
  backgroundColor: 'rgb(255, 111, 105)',
  borderRadius: 10,
  fontSize: 16,
  color: 'white',
  fontWeight: 'bold',
},

  //UserCard styling
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginVertical: 16,
  },
  
  userName: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111',
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },

  //UserScreen styling
  avatarLarge: {
    width: 220,
    height: 220,
    borderRadius: 80,
    marginBottom: 20
  },

  userProfileContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop:40,
    paddingVertical: 40,
  },

  pointsContainer: {
    marginTop: 20,
    alignItems: 'center',
  }, 

  pointsSubtitle: {
    fontSize: 22,
    color: '#eee',
    marginVertical: 4,
  },
  
  //delete button on UserScreen
  userScreenDeleteButton: {
    backgroundColor: 'rgb(255, 0, 0)',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    width: 320,
    alignSelf: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  userScreenDeleteBtnText: {
    borderRadius: 10,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'
  },
 /// Add task Screen
 input: {
  height: 48,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 12,
  fontSize: 16,
  color: '#333',
  backgroundColor: '#fff',
},
addChoreScreen_label: {
  fontSize: 16,
  fontWeight: '600',
  color: '#555',
  marginBottom: 6,
  marginTop: 10,
  },
// Group Screen
groupScreen_container: { flex: 1, paddingHorizontal: 20 },
groupSection_text: {
  fontSize: 16,
  fontWeight: '600',
  marginBottom: 12,
  color: '#555',
},

inputContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 20,
},

textInput: {
  flex: 1,
  height: 44,
  borderColor: '#ccc',
  borderWidth: 1,
  borderRadius: 10,
  paddingHorizontal: 15,
  backgroundColor: 'white',
  fontSize: 16,
  color: '#333',
},

addButton: {
  marginLeft: 12,
  borderRadius: 15,
  backgroundColor: 'white',
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 4,
},

userCardContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#fff',
  borderRadius: 12,
  paddingVertical: 12,
  paddingHorizontal: 16,
  marginBottom: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 3,
  elevation: 3,
},

userInfoContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},

avatar: {
  width: 48,
  height: 48,
  borderRadius: 24,
  marginRight: 12,
},

userTextContainer: {
  flexDirection: 'column',
},

GroupScreen_userName: {
  fontSize: 18,
  fontWeight: '600',
  color: '#222',
},

userPoints: {
  fontSize: 14,
  color: '#666',
  marginTop: 4,
},

deleteButton: {
  padding: 6,
  borderRadius: 20,
},
    });
