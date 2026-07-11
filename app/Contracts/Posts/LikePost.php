<?php

namespace App\Contracts\Posts;



interface LikePost{ 

 public function likePost(int $postId):array;

 public function deleteLike(int $postId):bool;

 

 
 public function getCountLike(int $postId):array; 

 public function historyLikePost(int $postId);


}