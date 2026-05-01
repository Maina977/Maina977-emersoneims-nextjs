output "backend_public_ip" {
  description = "Public IP of backend instance"
  value = aws_instance.borehole_backend.public_ip
}

output "backend_public_dns" {
  description = "Public DNS of backend instance"
  value = aws_instance.borehole_backend.public_dns
}

output "vpc_id" {
  description = "VPC ID"
  value = aws_vpc.borehole_vpc.id
}