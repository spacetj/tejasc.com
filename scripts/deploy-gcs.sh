gatsby build

cd ./public && gsutil -m rsync -R . ${BUCKET_NAME}

if [ $$? -eq 0 ]; then
    echo "✅ Deployed successfully";
else
    echo "❌ Deployment failed";
fi
