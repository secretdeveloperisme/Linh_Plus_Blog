create database linh_plus_blog;
use linh_plus_blog;
drop database linh_plus_blog;

/* ======= alter table =======  */
alter table posts add fulltext(title);
alter table tags add fulltext(name);
alter table users add fulltext(username);

/* ======= discribe table information =======  */
describe user_role;
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
/* ======= Select Query ======= */
select * from users;
select * from posts;
select * from categories;
select * from linh_plus_blog.post_categories;
select * from linh_plus_blog.post_tags;
select * from linh_plus_blog.tags;
select * from linh_plus_blog.likes;
select * from comments;
-- select comment and user, is comment like by user 
select comments.id, comments.parent_id, is_comment_like_by_user(comments.id,1) as is_comment_like_by_user,
	comments.post_id, comments.content, comment_likes.user_id,
    users.id as user_id,users.username, users.avatar,
    count(comment_likes.comment_id) as number_of_likes
  from
 (comments left join comment_likes on comment_likes.comment_id = comments.id) 
 inner join users on users.id = comments.user_id group by comments.id;
-- get posts that are user followed user or tag  
select  distinct posts.id as post_id,posts.createdAt as createdAt, posts.user_id as UserId from users
	inner join follow_tags on users.id = follow_tags.user_id
    inner join tags on follow_tags.tag_id = tags.id
	inner join post_tags on post_tags.tag_id = tags.id
    inner join posts on post_tags.post_id = posts.id
    where users.id = 2
union 
select distinct posts.id as post_id, posts.createdAt as createdAt, posts.user_id  as UserId from users
	inner join follow_users on follow_users.follower_id = users.id
    inner join posts on posts.user_id = follow_users.user_id
    where users.id = 2
order by createdAt desc
limit 0,5;
-- search posts
	select posts.id, title, slug, image, posts.createdAt , users.username
    from posts 
    inner join users on posts.user_id = users.id
    where match(title)
    against ("javascdriptsdfssdf")
	union distinct
    select posts.id, posts.title, posts.slug, posts.image, posts.createdAt,users.username  from 
    tags inner join post_tags on tags.id = post_tags.tag_id
    inner join posts on post_tags.post_id = posts.id
    inner join users on posts.user_id = users.id
    where match(tags.name)
    against ("git");
-- search users
	select username, avatar
    from users
    where match(username)
    against ("hoanglinh");
/* ====== insert data  ===== */
-- table statuses 
insert into statuses(id, name) values(1,"public");
insert into statuses(id, name) values(2,"private");
-- table roles
insert into roles(id, name) values(1,"admin");
insert into roles(id, name) values(2,"moderator");
insert into roles(id, name) values(3,"user");
-- table categories
insert into categories(id, name) values(1, "programming");
insert into categories(id, name) values(2, "book");
insert into categories(id, name) values(3, "tips");
insert into categories(id, name) values(4, "experience");
insert into categories(id, name) values(5, "bugs");
insert into categories(id, name) values(6, "questions")
insert into categories(id, name) values(7, "other")
/* ====== declare procedure ===== */
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
select is_comment_like_by_user(89, 9) as xxx;users
-- function amount_like;
delimiter $$
create function amount_likes(post_id int)
returns int
deterministic
begin 
	declare amount int default 0;
    set amount = (
		select count(likes.post_id) 
		from likes
		where likes.post_id = post_id
        and 
        likes.type_like = "like"
    );
    return amount;
end$$
select amount_likes(10);
drop function amount_likes;
-- function amount_comment;
delimiter $$
create function amount_comments(post_id int)
returns int
deterministic
begin 
	declare amount int default 0;
    set amount = (
		select count(comments.post_id) 
		from comments
		where comments.post_id = post_id
    );
    return amount;
end$$
select amount_comments(7);
drop function amount_comments;
/* ====== declare views ===== */
-- popular posts view
create view popular_posts 
as
select posts.id,title,slug,createdAt, count(id) as number_of_likes
	from posts 
    inner join likes on posts.id = likes.post_id
    where type_like = "like"
    group by posts.id,title,slug,createdAt
    order by number_of_likes DESC
    limit 0, 5;
-- amount of posts per month in current year statistics
create view amount_posts_per_month_in_current_year
as
	select month(createdAt) as month, count(id) as amount_of_posts
    from posts
    where year(createdAt) = year(current_date()) 
	group by month;
-- popular Users
select users.id, username, users.avatar
from users
inner join posts on users.id = posts.user_id
