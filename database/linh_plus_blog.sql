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
-- select query
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
-- get posts that are 
select  distinct posts.id as post_id,posts.createdAt as createdAt, posts.user_id as UserId from users
	inner join followtags on users.id = followtags.user_id
    inner join tags on followtags.tag_id = tags.id
	inner join post_tags on post_tags.TagId = tags.id
    inner join posts on post_tags.post_id = posts.id
    where users.id = 2
union 
select distinct posts.id as post_id, posts.createdAt as createdAt, posts.user_id  as UserId from users
	inner join follow_users on follow_users.follower_id = users.id
    inner join posts on posts.user_id = follow_users.user_id
    where users.id = 2
order by createdAt desc
limit 0,5
-- UPDATE `linh_plus_blog`.`posts` SET `deletedAt` = null;

-- alter table follow_users drop index follow_users_UserId_UserId_unique;

-- delete from posts ; 

-- declare procedure 
delimiter ??
create procedure get_popular_posts()
begin
select posts.id,title,slug,createdAt, count(id) as number_of_likes
	from posts 
    inner join likes on posts.id = likes.post_id
    where type_like = "like"
    group by posts.id,title,slug,createdAt
    order by number_of_likes DESC
    limit 0, 5;
end??
drop procedure get_popular_posts;
call get_popular_posts();
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