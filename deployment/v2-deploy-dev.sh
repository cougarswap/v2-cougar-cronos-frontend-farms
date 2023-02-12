aws s3 sync './build' s3://v2-cougar-web-farm-cronos-test/ --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers --delete --exclude '.git/*' --exclude '.vscode/*' --exclude 'package.json'
