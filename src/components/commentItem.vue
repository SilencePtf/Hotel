<template>
  <div class="commentItem">
    <el-row>
				<div class="comAvatar">
					<slot name="avatar"> </slot>
				</div>
      <div class="comText">
        <div class="userDiv">
          <slot name="username"> </slot>
        </div>
        <div class="comDiv">
          <slot name="comment"></slot>
        </div>
        <div class="dateDiv">
          <slot name="date"></slot>
        </div>
      </div>
    </el-row>
    <el-divider></el-divider>
  </div>
</template>

<script>
export default {
  name: "commentItem",
};
</script>

<style>
.comAvatar {
  width: 40px;
  height: 40px;
  border: 1px  #eee;
  border-radius: 50%;
  float: left;
	padding: 15px 10px 0 0;
}
.comAvatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.commentItem {
  width: 85%;
  margin: 0 auto;
}
.userDiv {
  width: 100%;
  font-size: 17px;
  line-height: 20px;
  font-weight: bold;
  padding: 5px 0 0 0;
}
.comDiv {
  width: 100%;
  font-size: 15px;
  padding: 0 0 5px 0;
  word-wrap:break-word;
}
.dateDiv {
  width: 100%;
  font-size: 10px;
  padding: 0 0 5px 0;
}
.commentItem .el-divider--horizontal {
  margin: 0;
}
.comText{
	width: 85%;
	float: left;
}
</style>