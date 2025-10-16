import React, { useEffect, useState } from "react";
import { Table, Drawer, Typography, Pagination, Select, DatePicker, Card, Tag, Button, message } from "antd";
import { getAllContacts, markContactAsRead } from "../Api/contactApi";
import { subscribeToContactEvents } from "../Api/contactApi";
import dayjs from "dayjs";
import {
  SearchOutlined,
  FilterOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  ReloadOutlined,
  UserOutlined
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
  const [showFilters, setShowFilters] = useState(false);
  const pageSize = 8;

  useEffect(() => {
    fetchContacts()

    const unsubscribe = subscribeToContactEvents({
      onContactCreated: (contact) =>
        setContacts((prev) => [{ ...contact, read: false }, ...prev]),
      onContactUpdated: (contact) => {
        setContacts((prev) =>
          prev.map(c => c._id === contact._id ? contact : c)
        );
      }
    });

    return () => unsubscribe();
  }, []);


  useEffect(() => {
    applyFilters();
  }, [contacts, dateRange, statusFilter, searchTerm]);

  const fetchContacts = async () => {
    const data = await getAllContacts();
    setContacts(data);
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

  const handleRowClick = async (record) => {
    setSelectedContact(record);
    setDrawerVisible(true);

    // Optimistically update UI
    setContacts((prev) =>
      prev.map((c) =>
        c._id === record._id ? { ...c, read: true } : c
      )
    );

    // Call backend
    try {
      await markContactAsRead(record._id);
    } catch (err) {
      message.error("Failed to mark as read", err);
      // Optionally revert UI if failed
      setContacts((prev) =>
        prev.map((c) =>
          c._id === record._id ? { ...c, read: false } : c
        )
      );
    }
  };


  const clearFilters = () => {
    setDateRange([]);
    setStatusFilter("all");
    setSearchTerm("");
    setShowFilters(false);
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

  // Mobile-optimized columns
  const mobileColumns = [
    {
      title: "Message",
      key: "message",
      render: (record) => (
        <div className="flex gap-3 w-full">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${!record.read ? 'bg-blue-500' : 'bg-gray-400'
                }`}
            >
              {getInitials(record.name)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-1">
              <div className="flex-1 min-w-0">
                <Text strong={!record.read} className="text-gray-800 block truncate text-sm">
                  {record.name}
                </Text>
                <Text type="secondary" className="text-xs block truncate">
                  {record.email}
                </Text>
              </div>
              <div className="flex-shrink-0 ml-2 flex items-center gap-1">
                {!record.read && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
                <Text type="secondary" className="text-xs whitespace-nowrap">
                  {dayjs(record.submittedAt).format("DD MMM")}
                </Text>
              </div>
            </div>

            {/* Message Preview */}
            <Text
              ellipsis={{ tooltip: record.message }}
              className={`block text-xs ${!record.read ? 'text-gray-900 font-medium' : 'text-gray-600'}`}
            >
              {record.message.split(" ").slice(0, 10).join(" ")}
              {record.message.split(" ").length > 10 ? "..." : ""}
            </Text>

            {/* Tags */}
            <div className="flex items-center gap-1 mt-2">
              {record.phone && (
                <Tag 
                  icon={<PhoneOutlined />} 
                  color="blue" 
                  size="small"
                  className="text-xs scale-90 origin-left"
                >
                  {record.phone}
                </Tag>
              )}
              <Text type="secondary" className="text-xs">
                {dayjs(record.submittedAt).format("HH:mm")}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const unreadCount = contacts.filter(contact => !contact.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header - Mobile Optimized */}
        <Card className="mb-4 sm:mb-6 shadow-sm border-0 rounded-2xl sm:rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <MailOutlined className="text-white text-lg sm:text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <Title level={4} className="mb-0 text-gray-800 sm:text-lg truncate">
                  Contact Messages
                </Title>
                <Text type="secondary" className="text-xs sm:text-sm">
                  {unreadCount} unread • {contacts.length} total
                </Text>
              </div>
            </div>

            <Button
              icon={<ReloadOutlined />}
              onClick={fetchContacts}
              className="flex items-center w-full sm:w-auto justify-center mt-2 sm:mt-0"
              size="small"
            >
              <span className="sm:inline">Refresh</span>
            </Button>
          </div>
        </Card>

        {/* Search Bar - Always Visible */}
        <Card className="mb-4 sm:mb-6 shadow-sm border-0 rounded-2xl p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {/* Filter Toggle Button - Mobile */}
            <div className="sm:hidden flex gap-2">
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1"
                size="small"
              >
                Filters
              </Button>
              {(dateRange.length > 0 || statusFilter !== "all" || searchTerm) && (
                <Button onClick={clearFilters} size="small" className="px-3">
                  Clear
                </Button>
              )}
            </div>
          </div>

          {/* Filters - Collapsible on Mobile */}
          <div className={`${showFilters ? 'block' : 'hidden'} sm:block mt-3 sm:mt-0`}>
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Date Range */}
              <div className="flex-1">
                <RangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  format="DD MMM YYYY"
                  placeholder={['Start Date', 'End Date']}
                  className="w-full rounded-lg text-sm"
                  suffixIcon={<CalendarOutlined />}
                  size="small"
                />
              </div>

              {/* Status Filter */}
              <div className="flex-1">
                <Select
                  value={statusFilter}
                  onChange={setStatusFilter}
                  className="w-full rounded-lg"
                  suffixIcon={<FilterOutlined />}
                  size="small"
                >
                  <Option value="all">All Messages</Option>
                  <Option value="unread">Unread</Option>
                  <Option value="read">Read</Option>
                </Select>
              </div>

              {/* Clear Button - Desktop */}
              <div className="hidden sm:block">
                {(dateRange.length > 0 || statusFilter !== "all" || searchTerm) && (
                  <Button onClick={clearFilters} className="rounded-lg" size="small">
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Messages List - Mobile Cards */}
        <Card className="shadow-sm border-0 rounded-2xl overflow-hidden">
          {/* Mobile View */}
          <div className="sm:hidden">
            {paginatedContacts.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {paginatedContacts.map((record) => (
                  <div
                    key={record._id}
                    onClick={() => handleRowClick(record)}
                    className={`p-4 cursor-pointer transition-all duration-200 hover:bg-blue-50 ${
                      !record.read ? 'bg-blue-25' : ''
                    }`}
                  >
                    {mobileColumns[0].render(record)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 px-4">
                <MailOutlined className="text-3xl text-gray-300 mb-3" />
                <Title level={5} className="text-gray-500 mb-2">
                  No messages found
                </Title>
                <Text type="secondary" className="text-sm">
                  {contacts.length === 0
                    ? "No contact messages received yet."
                    : "Try adjusting your filters."}
                </Text>
              </div>
            )}
          </div>

          {/* Desktop Table */}
          <div className="hidden sm:block">
            <Table
              dataSource={paginatedContacts}
              columns={[
                {
                  title: "Sender",
                  dataIndex: "name",
                  key: "name",
                  width: 200,
                  render: (text, record) => (
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${!record.read ? 'bg-blue-500' : 'bg-gray-400'
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
              ]}
              rowKey="_id"
              showHeader={false}
              pagination={false}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
                className: `cursor-pointer transition-all duration-200 hover:bg-blue-50 border-b border-gray-100 ${!record.read ? 'bg-blue-25' : ''
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
          </div>

          {/* Pagination */}
          {filteredContacts.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4 sm:mt-6 px-4 sm:px-6 py-4 border-t border-gray-100">
              <Text type="secondary" className="text-sm text-center sm:text-left">
                Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredContacts.length)} of {filteredContacts.length} messages
              </Text>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredContacts.length}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
                showQuickJumper={false}
                showLessItems={true}
                size="small"
                className="flex justify-center"
              />
            </div>
          )}
        </Card>
      </div>

      {/* Drawer for message details - Mobile Optimized */}
      <Drawer
        title={
          <div className="pr-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Text strong className="text-white text-sm">
                  {selectedContact ? getInitials(selectedContact.name) : ""}
                </Text>
              </div>
              <div className="flex-1 min-w-0">
                <Title level={4} className="mb-1 truncate text-base sm:text-lg">
                  {selectedContact?.name}
                </Title>
                <Text type="secondary" className="block truncate text-sm">
                  {selectedContact?.email}
                </Text>
              </div>
            </div>
          </div>
        }
        placement="right"
        width={window.innerWidth > 640 ? 480 : window.innerWidth - 32}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        className="rounded-l-2xl"
        styles={{
          body: {
            backgroundColor: "#fafafa",
            padding: "16px"
          },
          header: {
            padding: "16px 20px 12px 20px",
            borderBottom: "1px solid #f0f0f0"
          }
        }}
      >
        {selectedContact && (
          <div className="space-y-4">
            {/* Contact Info */}
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Text strong className="text-gray-600 text-xs sm:text-sm">Phone</Text>
                  <p className="mt-1 text-gray-900 text-sm sm:text-base">
                    {selectedContact.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <Text strong className="text-gray-600 text-xs sm:text-sm">Date</Text>
                  <p className="mt-1 text-gray-900 text-sm sm:text-base">
                    {dayjs(selectedContact.submittedAt).format("DD MMM YYYY, HH:mm")}
                  </p>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
              <Text strong className="text-gray-600 text-xs sm:text-sm block mb-2 sm:mb-3">
                Message
              </Text>
              <div className="leading-relaxed text-gray-800 whitespace-pre-line bg-gray-50 rounded-lg p-3 text-sm sm:text-base">
                {selectedContact.message}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}