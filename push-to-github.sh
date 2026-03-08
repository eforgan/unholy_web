#!/bin/bash

# UNHOLY DEVOTION - GitHub Push Script

echo "========================================="
echo "  UNHOLY DEVOTION - GitHub Setup"
echo "========================================="
echo ""

# Check if gh is installed
if ! command -v gh &> /dev/null; then
    echo "ERROR: GitHub CLI (gh) is not installed."
    echo ""
    echo "Please install it from: https://cli.github.com"
    echo "Or use GitHub Desktop: https://desktop.github.com"
    echo ""
    echo "Alternative: Create repository manually at github.com"
    echo "Then run: git remote add origin <your-repo-url>"
    echo "         git push -u origin master"
    exit 1
fi

# Check if user is logged in
gh auth status 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Please login to GitHub:"
    gh auth login
fi

# Get repository name
read -p "Repository name (default: unholy-devotion): " REPO_NAME
REPO_NAME=${REPO_NAME:-unholy-devotion}

# Create repository
echo ""
echo "Creating GitHub repository..."
gh repo create "$REPO_NAME" --public --source=. --description "UNHOLY DEVOTION - Digital Collective Website"

# Push to GitHub
echo ""
echo "Pushing to GitHub..."
git push -u origin master

echo ""
echo "========================================="
echo "  Done! Your site is on GitHub:"
echo "  https://github.com/$(gh api user --jq '.login')/$REPO_NAME"
echo "========================================="
