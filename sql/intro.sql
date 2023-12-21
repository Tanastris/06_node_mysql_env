-- create posts table

CREATE TABLE posts 
(post_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
 title VARCHAR(255) NOT NULL, 
 author VARCHAR(255) NOT NULL, 
 date DATE NOT NULL DEFAULT CURRENT_TIMESTAMP, 
 body TEXT NOT NULL, 
 PRIMARY KEY (post_id)) ENGINE = InnoDB;

--  Add one post

INSERT INTO `posts` 
(`title`, `author`, `date`, `body`)
 VALUES ('post 5', 'Mike Litoris', '2023-12-15', 'funny text');

--  Create all posts
INSERT INTO posts (title, author, date, body) VALUES
('Post 1', 'James Band', '2023-12-20', 'This is body of Post 1'),
('Post 2', 'Jane Dow', '2023-12-01', 'Body of post 2'),
('post 3 ', 'Rokas', '2023-12-20', 'very nice post');