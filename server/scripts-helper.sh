#!/bin/bash

# Circle Buro - Helpful Scripts Collection
# Useful commands for managing the deployment

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

show_menu() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}Circle Buro - Management Scripts${NC}"
    echo -e "${BLUE}========================================${NC}\n"
    echo "1. Check all containers status"
    echo "2. View frontend logs"
    echo "3. View nginx logs"
    echo "4. View backend logs"
    echo "5. Restart frontend"
    echo "6. Restart nginx"
    echo "7. Rebuild and restart frontend"
    echo "8. Check SSL certificates"
    echo "9. Test nginx configuration"
    echo "10. View resource usage"
    echo "11. Cleanup unused Docker resources"
    echo "12. Backup current configuration"
    echo "13. View all logs (combined)"
    echo "14. Check website health"
    echo "0. Exit"
    echo ""
}

check_status() {
    echo -e "${GREEN}Container Status:${NC}"
    docker-compose ps
    echo ""
    echo -e "${GREEN}Resource Usage:${NC}"
    docker stats --no-stream circle-buro-frontend circle-buro-nginx circle-buro-backend circle-buro-db
}

view_frontend_logs() {
    echo -e "${GREEN}Frontend Logs (Ctrl+C to exit):${NC}"
    docker logs -f --tail 100 circle-buro-frontend
}

view_nginx_logs() {
    echo -e "${GREEN}Nginx Logs (Ctrl+C to exit):${NC}"
    docker logs -f --tail 100 circle-buro-nginx
}

view_backend_logs() {
    echo -e "${GREEN}Backend Logs (Ctrl+C to exit):${NC}"
    docker logs -f --tail 100 circle-buro-backend
}

restart_frontend() {
    echo -e "${YELLOW}Restarting frontend...${NC}"
    docker-compose restart frontend
    echo -e "${GREEN}✓ Frontend restarted${NC}"
}

restart_nginx() {
    echo -e "${YELLOW}Restarting nginx...${NC}"
    docker-compose restart nginx
    echo -e "${GREEN}✓ Nginx restarted${NC}"
}

rebuild_frontend() {
    echo -e "${YELLOW}Rebuilding and restarting frontend...${NC}"
    docker-compose stop frontend
    docker-compose build --no-cache frontend
    docker-compose up -d frontend
    echo -e "${GREEN}✓ Frontend rebuilt and restarted${NC}"
}

check_ssl() {
    echo -e "${GREEN}SSL Certificates:${NC}"
    certbot certificates
    echo ""
    echo -e "${GREEN}Certificate files:${NC}"
    ls -lah ~/server/nginx/ssl/frontend/
    ls -lah ~/server/nginx/ssl/api/
}

test_nginx() {
    echo -e "${GREEN}Testing Nginx configuration:${NC}"
    docker exec circle-buro-nginx nginx -t
}

view_resources() {
    echo -e "${GREEN}Container Resource Usage:${NC}"
    docker stats --no-stream
}

cleanup_docker() {
    echo -e "${YELLOW}Cleaning up Docker resources...${NC}"
    docker system prune -f
    docker volume prune -f
    echo -e "${GREEN}✓ Cleanup complete${NC}"
}

backup_config() {
    BACKUP_DIR=~/server/backups/$(date +%Y%m%d_%H%M%S)
    mkdir -p $BACKUP_DIR
    
    echo -e "${YELLOW}Creating backup...${NC}"
    cp ~/server/docker-compose.yml $BACKUP_DIR/
    cp ~/server/nginx/nginx.conf $BACKUP_DIR/
    cp -r ~/server/nginx/ssl $BACKUP_DIR/
    
    echo -e "${GREEN}✓ Backup created at: $BACKUP_DIR${NC}"
}

view_all_logs() {
    echo -e "${GREEN}All Container Logs (last 50 lines each):${NC}"
    echo -e "\n${BLUE}=== FRONTEND ===${NC}"
    docker logs --tail 50 circle-buro-frontend
    echo -e "\n${BLUE}=== NGINX ===${NC}"
    docker logs --tail 50 circle-buro-nginx
    echo -e "\n${BLUE}=== BACKEND ===${NC}"
    docker logs --tail 50 circle-buro-backend
}

check_health() {
    echo -e "${GREEN}Checking website health:${NC}\n"
    
    echo -e "${BLUE}Frontend health:${NC}"
    docker exec circle-buro-frontend wget -q -O- http://localhost:80/health && echo "✓ OK" || echo "✗ Failed"
    
    echo -e "\n${BLUE}Backend health:${NC}"
    docker exec circle-buro-backend wget -q -O- http://localhost:3000/health && echo "✓ OK" || echo "✗ Failed"
    
    echo -e "\n${BLUE}External check (circle-buro.kz):${NC}"
    curl -I https://circle-buro.kz 2>/dev/null | head -n 1
    
    echo -e "\n${BLUE}External check (api.circleburo.kz):${NC}"
    curl -I https://api.circleburo.kz/health 2>/dev/null | head -n 1
}

# Main loop
while true; do
    show_menu
    read -p "Select option: " choice
    
    case $choice in
        1) check_status ;;
        2) view_frontend_logs ;;
        3) view_nginx_logs ;;
        4) view_backend_logs ;;
        5) restart_frontend ;;
        6) restart_nginx ;;
        7) rebuild_frontend ;;
        8) check_ssl ;;
        9) test_nginx ;;
        10) view_resources ;;
        11) cleanup_docker ;;
        12) backup_config ;;
        13) view_all_logs ;;
        14) check_health ;;
        0) echo -e "${GREEN}Goodbye!${NC}"; exit 0 ;;
        *) echo -e "${RED}Invalid option${NC}" ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done
