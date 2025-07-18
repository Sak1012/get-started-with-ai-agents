# Navigate to /frontend
Set-Location -Path ./frontend

# Run pnpm build
pnpm build

# Navigate back to /src
Set-Location -Path ..

# Run uvicorn with the specified parameters
python -m uvicorn "api.main:create_app" --factory --reload
