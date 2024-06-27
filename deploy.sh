# chmod 777 deploy.sh
# 更新依赖
npm i

# 构建
npm run build

# 进入构建的文件夹
cd ./dist

# 将构建的文件输出到nginx的静态目录
sudo mv * /var/www/html
