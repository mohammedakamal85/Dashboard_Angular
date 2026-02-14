import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  dashboardCards = [
    { title: 'Total Revenue', value: '$125,430', change: '+12.5%', icon: '💰', color: '#667eea' },
    { title: 'Active Users', value: '2,847', change: '+8.2%', icon: '👥', color: '#764ba2' },
    { title: 'Conversion Rate', value: '3.24%', change: '+4.3%', icon: '📊', color: '#f093fb' },
    { title: 'Avg. Order Value', value: '$87.50', change: '+2.1%', icon: '🛍️', color: '#4facfe' },
  ]
};
