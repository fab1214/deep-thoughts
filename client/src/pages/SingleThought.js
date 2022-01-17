import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHT } from '../utils/queries';
import ReactionList from '../components/ReactionList';
import ReactionForm from '../components/ReactionForm';
import Auth from "../utils/auth";

const SingleThought = props => {

  const { id: thoughtId } = useParams();
  const { loading, data  } = useQuery(QUERY_THOUGHT, {
    //id property on variables object will become the $id parameter in the GraphQL query
    variables: { id: thoughtId}
  });
  //check if there is data for thought. if there is assign to thought variable, if not create an empty array
  const thought = data?.thought || [];

  if (loading){
    return <div>Loading...</div>
  }
  return (
<div>
  <div className="card mb-3">
    <p className="card-header">
      <span style={{ fontWeight: 700 }} className="text-light">
        {thought.username}
        {/* {' ' } means space in a text block */}
      </span>{' '}
      thought on {thought.createdAt}
    </p>
    <div className="card-body">
      <p>{thought.thoughtText}</p>
    </div>
  </div>
  {/* if reactionCount is > 0 , render ReactionList component and pass in reactions array as a prop */}
  {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}
  {Auth.loggedIn() && <ReactionForm thoughtId={thought._id} />}
</div>

  );
};

export default SingleThought;
