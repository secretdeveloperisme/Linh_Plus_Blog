function convertHierarchyComments(allComments){
  allComments = allComments.map((comment)=>{
    return {
      id : comment.id,
      parentId : comment.parent_id,  
      content : comment.content,
      postId : comment.post_id,
      createdAt: comment.createdAt,
      amountOfLike : comment.amount_of_likes,
      isLikeByUser : comment.is_comment_like_by_user,
      user : {
        id : comment.user_id,
        username : comment.username,
        avatar : comment.avatar
      }
    }
  });
  console.log(allComments);
  let parents = [];
  let comments = [];
  for(let comment of allComments){
    if(comment.parentId == null){
      parents.push(comment);
      comments.push(comment)
    }
    else{
      let isFoundParent = false; 
      for(let parent of parents){
        if(comment.parentId == parent.id){
          if(parent.children == undefined){
            parent.children = [];
          }
          parent.children.push(comment);
          parents.push(comment)
          isFoundParent = true;
          break;
        }
      }
      if(!isFoundParent){
        throw new Error("comment does not have parent");
      }
    }
  }
  return comments;
}
module.exports = {convertHierarchyComments};