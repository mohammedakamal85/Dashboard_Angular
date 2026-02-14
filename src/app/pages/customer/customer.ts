import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  title: string;
  value: string;
  icon: string;
  color: string;
  unit?: string;
}

interface PieChartData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-customer',
  imports: [CommonModule],
  templateUrl: './customer.html',
  styleUrl: './customer.css',
})
export class Customer implements OnInit {
  greeting = 'Welcome Back!';
  userName = 'User';

  // Stats Cards
  statCards: StatCard[] = [
    {
      title: 'Total Orders',
      value: '24',
      icon: '📦',
      color: '#4facfe',
      unit: 'orders',
    },
    {
      title: 'Total Spent',
      value: '$2,450',
      icon: '💰',
      color: '#27ae60',
      unit: 'USD',
    },
    {
      title: 'Pending Orders',
      value: '3',
      icon: '⏳',
      color: '#f5a623',
      unit: 'orders',
    },
    {
      title: 'Loyalty Points',
      value: '1,250',
      icon: '⭐',
      color: '#9b59b6',
      unit: 'points',
    },
  ];

  // Pie Chart Data
  pieChartData: PieChartData[] = [
    {
      label: 'Delivered',
      value: 16,
      percentage: 66.67,
      color: '#27ae60',
    },
    {
      label: 'Processing',
      value: 5,
      percentage: 20.83,
      color: '#f5a623',
    },
    {
      label: 'Cancelled',
      value: 3,
      percentage: 12.5,
      color: '#e74c3c',
    },
  ];

  totalOrders = this.pieChartData.reduce((sum, item) => sum + item.value, 0);

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    // Simulate loading user data
    const authUser = localStorage.getItem('auth_user');
    if (authUser) {
      try {
        const user = JSON.parse(authUser);
        this.userName = user.name || 'User';
      } catch (e) {
        this.userName = 'User';
      }
    }
  }

  // Calculate pie chart path for SVG
  calculatePieSlice(
    index: number,
    centerX: number,
    centerY: number,
    radius: number,
  ): { path: string; startAngle: number; endAngle: number } {
    let currentAngle = 0;

    // Calculate starting angle
    for (let i = 0; i < index; i++) {
      currentAngle += (this.pieChartData[i].value / this.totalOrders) * 360;
    }

    const startAngle = currentAngle;
    const endAngle = startAngle + (this.pieChartData[index].value / this.totalOrders) * 360;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return { path, startAngle, endAngle };
  }
}
