import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import ThoughtList from '../components/ThoughtList';
import { useQuery } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import FriendList from '../components/FriendList';
import Auth from '../utils/auth';

const Profile = () => {
  //retrieve username from URL using useParams() (storing it as userParameter);
  const { username: userParameter } = useParams();

  //if /profile/$username, run QUERY_USER. if just /profile (logged in user) run QUERY_ME
  const { loading, data } = useQuery(userParameter ? QUERY_USER : QUERY_ME, {
    variables: { username: userParameter }
  });

  //if we run QUERY_ME, response = data.me, if we run QUERY_USER, response = data.user
  const user = data?.me || data?.user || {};

  //if loggedIn user and username stored in JWT === userParameter...
  if(Auth.loggedIn() && Auth.getProfile().data.username === userParameter){
    //redirect to user profile
    return <Redirect to='/profile' />
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  //if user data doesnt exist and tries to go to /profile URL, send message
  if(!user.username){
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation link above to sign up or log in!
      </h4>
    );
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          {/* if userParamater doesnt exist, it will default to 'your profile'. If exists, pull user.username */}
          Viewing {userParameter ? `{user.username}'s` : 'your'} profile.
        </h2>
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          {/* pass props from the ThoughtList component (thoughts & title) to render a list of thoughts unique to user */}
          <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
        </div>
        <div className='col-12 col-lg-3 mb-3'>
          {/* pass in FriendList props (username, friendCount, friends) */}
        <FriendList 
        username={user.username}
        friendCount={user.friendCount}
        friends={user.friends} 
        />
        </div>
      </div>
    </div>
  );
};
export default Profile;
