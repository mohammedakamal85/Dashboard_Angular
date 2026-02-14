import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  change: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

@Component({
  selector: 'app-admin',
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  stats: StatCard[] = [
    {
      label: 'Total Users',
      value: 2847,
      icon: '👥',
      color: '#667eea',
      change: '+12.5%',
    },
    {
      label: 'Active Sessions',
      value: 583,
      icon: '⚡',
      color: '#764ba2',
      change: '+8.2%',
    },
    {
      label: 'Revenue',
      value: '$48.5K',
      icon: '💰',
      color: '#f093fb',
      change: '+23.1%',
    },
    {
      label: 'Conversion',
      value: '3.24%',
      icon: '📊',
      color: '#4facfe',
      change: '+4.3%',
    },
  ];

  pieChartData = {
    labels: ['Premium', 'Standard', 'Free'],
    values: [45, 30, 25],
    colors: ['#667eea', '#764ba2', '#f093fb'],
  };

  recentUsers: User[] = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      role: 'Admin',
      status: 'Active',
      joinDate: '2026-01-15',
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob.smith@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2026-01-20',
    },
    {
      id: 3,
      name: 'Carol Williams',
      email: 'carol.williams@example.com',
      role: 'Moderator',
      status: 'Inactive',
      joinDate: '2026-02-01',
    },
    {
      id: 4,
      name: 'David Brown',
      email: 'david.brown@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2026-02-05',
    },
    {
      id: 5,
      name: 'Eva Davis',
      email: 'eva.davis@example.com',
      role: 'User',
      status: 'Active',
      joinDate: '2026-02-10',
    },
  ];

  ngOnInit(): void {}

  calculatePieSegment(value: number, total: number): number {
    return (value / total) * 100;
  }

  getPieChartTotal(): number {
    return this.pieChartData.values.reduce((a, b) => a + b, 0);
  }

  calculateStrokeDashOffset(index: number): number {
    const previousValues = this.pieChartData.values.slice(0, index);
    const previousSum = previousValues.reduce((a, b) => a + b, 0);
    return (previousSum / this.getPieChartTotal()) * 534;
  }
}
