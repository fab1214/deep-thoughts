import React from 'react';
import { useParams } from 'react-router-dom';
import ThoughtList from '../components/ThoughtList';
import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';
import FriendList from '../components/FriendList';

const Profile = () => {
  //retrieve username from URL using useParams() (storing it as userParameter);
  const { username: userParameter } = useParams();

  const { loading, data } = useQuery(QUERY_USER, {
    variables: { username: userParameter }
  });

  const user = data?.user || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {user.username}'s profile.
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
