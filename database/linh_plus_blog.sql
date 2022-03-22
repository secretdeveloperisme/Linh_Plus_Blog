show tables;
create database linh_plus_blog;
use linh_plus_blog;
drop database linh_plus_blog;

describe post_tags;
describe posts;
describe comments;
describe users;
describe follow_users;
describe linh_plus_blog.comment_likes;

show index from post_tags;
show index from follow_users;
show index from likes;

SHOW CREATE TABLE likes;
SHOW CREATE TABLE follow_users;

select * from users;
select * from posts;
select * from categories;
select * from linh_plus_blog.post_categories;
select * from linh_plus_blog.post_tags;
select * from linh_plus_blog.tags;
select * from linh_plus_blog.likes;
select * from comments;
select comments.id, comments.parent_id,is_comment_like_by_user(comments.id,8) as is_comment_like_by_user,
	comments.post_id, comments.content, comment_likes.user_id,
    users.id as user_id,users.username, users.avatar,
    count(comment_likes.comment_id) as number_of_likes
  from
 (comments left join comment_likes on comment_likes.comment_id = comments.id) 
 inner join users on users.id = comments.user_id group by comments.id;


alter table follow_users drop index follow_users_UserId_UserId_unique;

delete from posts ;


-- declare functions 
delimiter ??
create function is_comment_like_by_user( comment_id int, user_id int)
returns INT
deterministic
begin 
	declare amount int default 0;
    set amount = (select count(user_id) as amount from comment_likes where comment_likes.comment_id = comment_id and comment_likes.user_id = user_id);
    return amount;
	if(amount > 0)
    then
		return 1;
	else 
		return 0;
	end if;
end??
drop function is_comment_like_by_user;
select is_comment_like_by_user(89, 9) as xxx;