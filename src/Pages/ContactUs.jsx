import React, { useEffect, useState } from "react";
import { Table, Drawer, Typography, Pagination, Select, DatePicker, Card, Tag, Button } from "antd";
import { getAllContacts } from "../Api/contactApi";
import { subscribeToContactEvents } from "../Api/contactApi";
import dayjs from "dayjs";
import { 
  SearchOutlined, 
  FilterOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  CalendarOutlined,
  ReloadOutlined 
} from "@ant-design/icons";

const { Text, Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

export default function ContactDashboard() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 8;

  useEffect(() => {
    fetchContacts();

    const unsubscribe = subscribeToContactEvents({
      onContactCreated: (contact) =>
        setContacts((prev) => [{ ...contact, read: false }, ...prev]),
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [contacts, dateRange, statusFilter, searchTerm]);

  const fetchContacts = async () => {
    const data = await getAllContacts();
    setContacts(data.map((c) => ({ ...c, read: false })));
  };

  const applyFilters = () => {
    let filtered = [...contacts];

    // Date range filter
    if (dateRange && dateRange.length === 2) {
      const [start, end] = dateRange;
      filtered = filtered.filter(contact =>
        dayjs(contact.submittedAt).isBetween(start, end, 'day', '[]')
      );
    }

    // Status filter (read/unread)
    if (statusFilter !== "all") {
      filtered = filtered.filter(contact => 
        statusFilter === "unread" ? !contact.read : contact.read
      );
    }

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(term) ||
        contact.email.toLowerCase().includes(term) ||
        contact.message.toLowerCase().includes(term) ||
        (contact.phone && contact.phone.includes(term))
      );
    }

    setFilteredContacts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleRowClick = (record) => {
    setSelectedContact(record);
    setDrawerVisible(true);
    setContacts((prev) =>
      prev.map((c) =>
        c._id === record._id ? { ...c, read: true } : c
      )
    );
  };

  const clearFilters = () => {
    setDateRange([]);
    setStatusFilter("all");
    setSearchTerm("");
  };

  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const columns = [
    {
      title: "Sender",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
              !record.read ? 'bg-blue-500' : 'bg-gray-400'
            }`}
          >
            {getInitials(text)}
          </div>
          <div className="flex-1 min-w-0">
            <Text strong={!record.read} className="text-gray-800 block truncate">
              {text}
            </Text>
            <Text type="secondary" className="text-xs block truncate">
              {record.email}
            </Text>
          </div>
          {!record.read && (
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          )}
        </div>
      ),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (text, record) => {
        const shortText = text.split(" ").slice(0, 12).join(" ");
        return (
          <div className="min-w-0">
            <Text
              ellipsis={{ tooltip: text }}
              strong={!record.read}
              className={`block ${!record.read ? 'text-gray-900' : 'text-gray-600'}`}
            >
              {shortText}
            </Text>
            <div className="flex items-center gap-2 mt-1">
              {record.phone && (
                <Tag icon={<PhoneOutlined />} color="blue" size="small">
                  {record.phone}
                </Tag>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "submittedAt",
      key: "submittedAt",
      width: 100,
      render: (text, record) => (
        <div className="text-right">
          <Text 
            strong={!record.read} 
            className={`block ${!record.read ? 'text-gray-900' : 'text-gray-500'}`}
          >
            {dayjs(text).format("DD MMM")}
          </Text>
          <Text type="secondary" className="text-xs block">
            {dayjs(text).format("HH:mm")}
          </Text>
        </div>
      ),
    },
  ];

  const unreadCount = contacts.filter(contact => !contact.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6 shadow-sm border-0 rounded-2xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <MailOutlined className="text-white text-xl" />
              </div>
              <div>
                <Title level={3} className="mb-0 text-gray-800">
                  Contact Messages
                </Title>
                <Text type="secondary">
                  {unreadCount} unread {unreadCount === 1 ? 'message' : 'messages'} • {contacts.length} total
                </Text>
              </div>
            </div>
            
            <Button 
              icon={<ReloadOutlined />} 
              onClick={fetchContacts}
              className="flex items-center"
            >
              Refresh
            </Button>
          </div>
        </Card>

        {/* Filters */}
        <Card className="mb-6 shadow-sm border-0 rounded-2xl">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages, names, emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="flex gap-3">
              <RangePicker
                value={dateRange}
                onChange={setDateRange}
                format="DD MMM YYYY"
                placeholder={['Start Date', 'End Date']}
                className="rounded-lg"
                suffixIcon={<CalendarOutlined />}
              />

              {/* Status Filter */}
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                className="min-w-[120px] rounded-lg"
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">All Messages</Option>
                <Option value="unread">Unread</Option>
                <Option value="read">Read</Option>
              </Select>

              {(dateRange.length > 0 || statusFilter !== "all" || searchTerm) && (
                <Button onClick={clearFilters} className="rounded-lg">
                  Clear
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Messages Table */}
        <Card className="shadow-sm border-0 rounded-2xl overflow-hidden">
          <Table
            dataSource={paginatedContacts}
            columns={columns}
            rowKey="_id"
            showHeader={false}
            pagination={false}
            onRow={(record) => ({
              onClick: () => handleRowClick(record),
              className: `cursor-pointer transition-all duration-200 hover:bg-blue-50 border-b border-gray-100 ${
                !record.read ? 'bg-blue-25' : ''
              }`,
              style: {
                padding: "16px 20px",
              },
            })}
            locale={{
              emptyText: (
                <div className="text-center py-12">
                  <MailOutlined className="text-4xl text-gray-300 mb-4" />
                  <Title level={4} className="text-gray-500">
                    No messages found
                  </Title>
                  <Text type="secondary">
                    {contacts.length === 0 
                      ? "No contact messages have been received yet." 
                      : "Try adjusting your filters to see more results."}
                  </Text>
                </div>
              )
            }}
          />

          {/* Pagination */}
          {filteredContacts.length > 0 && (
            <div className="flex justify-between items-center mt-6 px-6 py-4 border-t border-gray-100">
              <Text type="secondary">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredContacts.length)} of {filteredContacts.length} messages
              </Text>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredContacts.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                showQuickJumper
                className="flex items-center"
              />
            </div>
          )}
        </Card>
      </div>

      {/* Drawer for message details */}
      <Drawer
        title={
          <div className="pr-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Text strong className="text-white text-sm">
                  {selectedContact ? getInitials(selectedContact.name) : ""}
                </Text>
              </div>
              <div className="flex-1 min-w-0">
                <Title level={4} className="mb-1 truncate">
                  {selectedContact?.name}
                </Title>
                <Text type="secondary" className="block truncate">
                  {selectedContact?.email}
                </Text>
              </div>
            </div>
          </div>
        }
        placement="right"
        width={480}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="rounded-l-2xl"
        styles={{
          body: { 
            backgroundColor: "#fafafa", 
            padding: "24px" 
          },
          header: {
            padding: "24px 24px 16px 24px",
            borderBottom: "1px solid #f0f0f0"
          }
        }}
      >
        {selectedContact && (
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text strong className="text-gray-600 text-sm">Phone</Text>
                  <p className="mt-1 text-gray-900">
                    {selectedContact.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <Text strong className="text-gray-600 text-sm">Date</Text>
                  <p className="mt-1 text-gray-900">
                    {dayjs(selectedContact.submittedAt).format("DD MMM YYYY, HH:mm")}
                  </p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <Text strong className="text-gray-600 text-sm block mb-3">
                Message
              </Text>
              <div className="leading-relaxed text-gray-800 whitespace-pre-line bg-gray-50 rounded-lg p-4">
                {selectedContact.message}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}