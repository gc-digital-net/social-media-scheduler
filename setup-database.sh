#!/bin/bash

echo "🚀 Social Media Scheduler - Database Setup"
echo "=========================================="
echo ""
echo "📋 I've created a SQL file with all your tables: COPY_TO_SUPABASE.sql"
echo ""
echo "To complete setup:"
echo "1. Opening Supabase SQL Editor in your browser..."
echo "2. Copy ALL content from COPY_TO_SUPABASE.sql"
echo "3. Paste it in the SQL editor"
echo "4. Click the green 'Run' button"
echo ""

# Try to open the URL
URL="https://supabase.com/dashboard/project/nalcyoudkabwzdmcgfui/sql/new"

if command -v xdg-open > /dev/null; then
    xdg-open "$URL"
elif command -v open > /dev/null; then
    open "$URL"
elif command -v start > /dev/null; then
    start "$URL"
else
    echo "Please open this URL manually:"
    echo "$URL"
fi

echo ""
echo "📄 The SQL file is at: $(pwd)/COPY_TO_SUPABASE.sql"
echo ""
echo "After running the SQL, test with: npm run dev"