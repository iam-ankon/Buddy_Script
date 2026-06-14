import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: '', image: null, privacy: 'public' });
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showDropdown, setShowDropdown] = useState(null);
  const [showNotifyDrop, setShowNotifyDrop] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/posts/');
      setPosts(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('content', newPost.content);
    formData.append('privacy', newPost.privacy);
    if (newPost.image) {
      formData.append('image', newPost.image);
    }
    try {
      const response = await axios.post('http://localhost:8000/api/posts/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setPosts([response.data, ...posts]);
      setNewPost({ content: '', image: null, privacy: 'public' });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:8000/api/posts/${postId}/like/`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;
    try {
      await axios.post(`http://localhost:8000/api/posts/${postId}/comment/`, { content });
      setCommentInputs({ ...commentInputs, [postId]: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  const handleCommentLike = async (commentId) => {
    try {
      await axios.post(`http://localhost:8000/api/comments/${commentId}/like/`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleReply = async (commentId) => {
    const content = replyInputs[commentId];
    if (!content?.trim()) return;
    try {
      await axios.post(`http://localhost:8000/api/comments/${commentId}/reply/`, { content });
      setReplyInputs({ ...replyInputs, [commentId]: '' });
      fetchPosts();
    } catch (error) {
      console.error('Error replying:', error);
    }
  };

  const handleReplyLike = async (replyId) => {
    try {
      await axios.post(`http://localhost:8000/api/replies/${replyId}/like/`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking reply:', error);
    }
  };

  const handleEditPost = async (postId) => {
    try {
      await axios.patch(`http://localhost:8000/api/posts/${postId}/`, { content: editContent });
      setEditingPost(null);
      setEditContent('');
      fetchPosts();
    } catch (error) {
      console.error('Error editing post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:8000/api/posts/${postId}/`);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="_layout _layout_main_wrapper">

      {/* ── Dark/Light Mode Switcher ── */}
      <div className="_layout_mode_swithing_btn">
        <button type="button" className="_layout_swithing_btn_link">
          <div className="_layout_swithing_btn">
            <div className="_layout_swithing_btn_round"></div>
          </div>
          <div className="_layout_change_btn_ic1">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="16" fill="none" viewBox="0 0 11 16">
              <path fill="#fff" d="M2.727 14.977l.04-.498-.04.498zm-1.72-.49l.489-.11-.489.11zM3.232 1.212L3.514.8l-.282.413zM9.792 8a6.5 6.5 0 00-6.5-6.5v-1a7.5 7.5 0 017.5 7.5h-1zm-6.5 6.5a6.5 6.5 0 006.5-6.5h1a7.5 7.5 0 01-7.5 7.5v-1zm-.525-.02c.173.013.348.02.525.02v1c-.204 0-.405-.008-.605-.024l.08-.997zm-.261-1.83A6.498 6.498 0 005.792 7h1a7.498 7.498 0 01-3.791 6.52l-.495-.87zM5.792 7a6.493 6.493 0 00-2.841-5.374L3.514.8A7.493 7.493 0 016.792 7h-1zm-3.105 8.476c-.528-.042-.985-.077-1.314-.155-.316-.075-.746-.242-.854-.726l.977-.217c-.028-.124-.145-.09.106-.03.237.056.6.086 1.165.131l-.08.997zm.314-1.956c-.622.354-1.045.596-1.31.792a.967.967 0 00-.204.185c-.01.013.027-.038.009-.12l-.977.218a.836.836 0 01.144-.666c.112-.162.27-.3.433-.42.324-.24.814-.519 1.41-.858L3 13.52zM3.292 1.5a.391.391 0 00.374-.285A.382.382 0 003.514.8l-.563.826A.618.618 0 012.702.95a.609.609 0 01.59-.45v1z" />
            </svg>
          </div>
          <div className="_layout_change_btn_ic2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4.389" stroke="#fff" transform="rotate(-90 12 12)" />
              <path stroke="#fff" strokeLinecap="round" d="M3.444 12H1M23 12h-2.444M5.95 5.95L4.222 4.22M19.778 19.779L18.05 18.05M12 3.444V1M12 23v-2.445M18.05 5.95l1.728-1.729M4.222 19.779L5.95 18.05" />
            </svg>
          </div>
        </button>
      </div>

      <div className="_main_layout">

        {/* ── Desktop Navbar ── */}
        <nav className="navbar navbar-expand-lg navbar-light _header_nav _padd_t10">
          <div className="container _custom_container">
            <div className="_logo_wrap">
              <a className="navbar-brand" href="#">
                <img src="/assets/images/logo.svg" alt="Image" className="_nav_logo" />
              </a>
            </div>
            <button className="navbar-toggler bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <div className="_header_form ms-auto">
                <form className="_header_form_grp">
                  <svg className="_header_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                    <circle cx="7" cy="7" r="6" stroke="#666" />
                    <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                  </svg>
                  <input className="form-control me-2 _inpt1" type="search" placeholder="input search text" aria-label="Search" />
                </form>
              </div>

              <ul className="navbar-nav mb-2 mb-lg-0 _header_nav_list ms-auto _mar_r8">
                {/* Home */}
                <li className="nav-item _header_nav_item">
                  <a className="nav-link _header_nav_link_active _header_nav_link" aria-current="page" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" fill="none" viewBox="0 0 18 21">
                      <path className="_home_active" stroke="#000" strokeWidth="1.5" strokeOpacity=".6" d="M1 9.924c0-1.552 0-2.328.314-3.01.313-.682.902-1.187 2.08-2.196l1.143-.98C6.667 1.913 7.732 1 9 1c1.268 0 2.333.913 4.463 2.738l1.142.98c1.179 1.01 1.768 1.514 2.081 2.196.314.682.314 1.458.314 3.01v4.846c0 2.155 0 3.233-.67 3.902-.669.67-1.746.67-3.901.67H5.57c-2.155 0-3.232 0-3.902-.67C1 18.002 1 16.925 1 14.77V9.924z" />
                      <path className="_home_active" stroke="#000" strokeOpacity=".6" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.857 19.341v-5.857a1 1 0 00-1-1H7.143a1 1 0 00-1 1v5.857" />
                    </svg>
                  </a>
                </li>
                {/* Friends */}
                <li className="nav-item _header_nav_item">
                  <a className="nav-link _header_nav_link" aria-current="page" href="friend-request.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="20" fill="none" viewBox="0 0 26 20">
                      <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M12.79 12.15h.429c2.268.015 7.45.243 7.45 3.732 0 3.466-5.002 3.692-7.415 3.707h-.894c-2.268-.015-7.452-.243-7.452-3.727 0-3.47 5.184-3.697 7.452-3.711l.297-.001h.132zm0 1.75c-2.792 0-6.12.34-6.12 1.962 0 1.585 3.13 1.955 5.864 1.976l.255.002c2.792 0 6.118-.34 6.118-1.958 0-1.638-3.326-1.982-6.118-1.982zm9.343-2.224c2.846.424 3.444 1.751 3.444 2.79 0 .636-.251 1.794-1.931 2.43a.882.882 0 01-1.137-.506.873.873 0 01.51-1.13c.796-.3.796-.633.796-.793 0-.511-.654-.868-1.944-1.06a.878.878 0 01-.741-.996.886.886 0 011.003-.735zm-17.685.735a.878.878 0 01-.742.997c-1.29.19-1.944.548-1.944 1.059 0 .16 0 .491.798.793a.873.873 0 01-.314 1.693.897.897 0 01-.313-.057C.25 16.259 0 15.1 0 14.466c0-1.037.598-2.366 3.446-2.79.485-.06.929.257 1.002.735zM12.789 0c2.96 0 5.368 2.392 5.368 5.33 0 2.94-2.407 5.331-5.368 5.331h-.031a5.329 5.329 0 01-3.782-1.57 5.253 5.253 0 01-1.553-3.764C7.423 2.392 9.83 0 12.789 0zm0 1.75c-1.987 0-3.604 1.607-3.604 3.58a3.526 3.526 0 001.04 2.527 3.58 3.58 0 002.535 1.054l.03.875v-.875c1.987 0 3.605-1.605 3.605-3.58S14.777 1.75 12.789 1.75zm7.27-.607a4.222 4.222 0 013.566 4.172c-.004 2.094-1.58 3.89-3.665 4.181a.88.88 0 01-.994-.745.875.875 0 01.75-.989 2.494 2.494 0 002.147-2.45 2.473 2.473 0 00-2.09-2.443.876.876 0 01-.726-1.005.881.881 0 011.013-.721zm-13.528.72a.876.876 0 01-.726 1.006 2.474 2.474 0 00-2.09 2.446A2.493 2.493 0 005.86 7.762a.875.875 0 11-.243 1.734c-2.085-.29-3.66-2.087-3.664-4.179 0-2.082 1.5-3.837 3.566-4.174a.876.876 0 011.012.72z" clipRule="evenodd" />
                    </svg>
                  </a>
                </li>
                {/* Notifications */}
                <li className="nav-item _header_nav_item">
                  <span
                    className="nav-link _header_nav_link _header_notify_btn"
                    onClick={() => setShowNotifyDrop(!showNotifyDrop)}
                    style={{ cursor: 'pointer', position: 'relative' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                      <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd" />
                    </svg>
                    <span className="_counting">6</span>
                    {/* Notification Dropdown */}
                    <div className={`_notification_dropdown${showNotifyDrop ? ' show' : ''}`}>
                      <div className="_notifications_content">
                        <h4 className="_notifications_content_title">Notifications</h4>
                        <div className="_notification_box_right">
                          <button type="button" className="_notification_box_right_link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                              <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                              <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                              <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                            </svg>
                          </button>
                          <div className="_notifications_drop_right">
                            <ul className="_notification_list">
                              <li className="_notification_item"><span className="_notification_link">Mark as all read</span></li>
                              <li className="_notification_item"><span className="_notification_link">Notifications settings</span></li>
                              <li className="_notification_item"><span className="_notification_link">Open Notifications</span></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="_notifications_drop_box">
                        <div className="_notifications_drop_btn_grp">
                          <button className="_notifications_btn_link">All</button>
                          <button className="_notifications_btn_link1">Unread</button>
                        </div>
                        <div className="_notifications_all">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="_notification_box">
                              <div className="_notification_image">
                                <img src="/assets/images/friend-req.png" alt="Image" className="_notify_img" />
                              </div>
                              <div className="_notification_txt">
                                <p className="_notification_para">
                                  <span className="_notify_txt_link">Steve Jobs</span> posted a link in your timeline.
                                </p>
                                <div className="_nitification_time"><span>42 minutes ago</span></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </span>
                </li>
                {/* Chat */}
                <li className="nav-item _header_nav_item">
                  <a className="nav-link _header_nav_link" href="chat.html">
                    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" fill="none" viewBox="0 0 23 22">
                      <path fill="#000" fillOpacity=".6" fillRule="evenodd" d="M11.43 0c2.96 0 5.743 1.143 7.833 3.22 4.32 4.29 4.32 11.271 0 15.562C17.145 20.886 14.293 22 11.405 22c-1.575 0-3.16-.33-4.643-1.012-.437-.174-.847-.338-1.14-.338-.338.002-.793.158-1.232.308-.9.307-2.022.69-2.852-.131-.826-.822-.445-1.932-.138-2.826.152-.44.307-.895.307-1.239 0-.282-.137-.642-.347-1.161C-.57 11.46.322 6.47 3.596 3.22A11.04 11.04 0 0111.43 0zm0 1.535A9.5 9.5 0 004.69 4.307a9.463 9.463 0 00-1.91 10.686c.241.592.474 1.17.474 1.77 0 .598-.207 1.201-.39 1.733-.15.439-.378 1.1-.231 1.245.143.147.813-.085 1.255-.235.53-.18 1.133-.387 1.73-.391.597 0 1.161.225 1.758.463 3.655 1.679 7.98.915 10.796-1.881 3.716-3.693 3.716-9.7 0-13.391a9.5 9.5 0 00-6.74-2.77zm4.068 8.867c.57 0 1.03.458 1.03 1.024 0 .566-.46 1.023-1.03 1.023a1.023 1.023 0 11-.01-2.047h.01zm-4.131 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.03 1.03 0 01-1.035-1.024c0-.566.455-1.023 1.025-1.023h.01zm-4.132 0c.568 0 1.03.458 1.03 1.024 0 .566-.462 1.023-1.03 1.023a1.022 1.022 0 11-.01-2.047h.01z" clipRule="evenodd" />
                    </svg>
                    <span className="_counting">2</span>
                  </a>
                </li>
              </ul>

              {/* Profile Dropdown */}
              <div className="_header_nav_profile">
                <div className="_header_nav_profile_image">
                  <img src="/assets/images/profile.png" alt="Image" className="_nav_profile_img" />
                </div>
                <div className="_header_nav_dropdown">
                  <p className="_header_nav_para">{user?.first_name} {user?.last_name}</p>
                  <button onClick={logout} className="_header_nav_dropdown_btn _dropdown_toggle" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none" viewBox="0 0 10 6">
                      <path fill="#112032" d="M5 5l.354.354L5 5.707l-.354-.353L5 5zm4.354-3.646l-4 4-.708-.708 4-4 .708.708zm-4.708 4l-4-4 .708-.708 4 4-.708.708z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* ── Mobile Top Menu ── */}
        <div className="_header_mobile_menu">
          <div className="_header_mobile_menu_wrap">
            <div className="container">
              <div className="_header_mobile_menu">
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="_header_mobile_menu_top_inner">
                      <div className="_header_mobile_menu_logo">
                        <a href="#" className="_mobile_logo_link">
                          <img src="/assets/images/logo.svg" alt="Image" className="_nav_logo" />
                        </a>
                      </div>
                      <div className="_header_mobile_menu_right">
                        <form className="_header_form_grp">
                          <a href="#" className="_header_mobile_search">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                              <circle cx="7" cy="7" r="6" stroke="#666" />
                              <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                            </svg>
                          </a>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Mobile Bottom Navigation ── */}
        <div className="_mobile_navigation_bottom_wrapper">
          <div className="_mobile_navigation_bottom_wrap">
            <div className="container">
              <div className="row">
                <div className="col-xl-12 col-lg-12 col-md-12">
                  <ul className="_mobile_navigation_bottom_list">
                    <li className="_mobile_navigation_bottom_item">
                      <a href="#" className="_mobile_navigation_bottom_link _mobile_navigation_bottom_link_active">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="27" fill="none" viewBox="0 0 24 27">
                          <path className="_mobile_svg" fill="#000" fillOpacity=".6" stroke="#666666" strokeWidth="1.5" d="M1 13.042c0-2.094 0-3.141.431-4.061.432-.92 1.242-1.602 2.862-2.965l1.571-1.321C8.792 2.232 10.256 1 12 1c1.744 0 3.208 1.232 6.136 3.695l1.572 1.321c1.62 1.363 2.43 2.044 2.86 2.965.432.92.432 1.967.432 4.06v6.54c0 2.908 0 4.362-.92 5.265-.921.904-2.403.904-5.366.904H7.286c-2.963 0-4.445 0-5.365-.904C1 23.944 1 22.49 1 19.581v-6.54z" />
                          <path fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.07 18.497h5.857v7.253H9.07v-7.253z" />
                        </svg>
                      </a>
                    </li>
                    <li className="_mobile_navigation_bottom_item">
                      <a href="friend-request.html" className="_mobile_navigation_bottom_link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="20" fill="none" viewBox="0 0 27 20">
                          <path className="_dark_svg" fill="#000" fillOpacity=".6" fillRule="evenodd" d="M13.334 12.405h.138l.31.001c2.364.015 7.768.247 7.768 3.81 0 3.538-5.215 3.769-7.732 3.784h-.932c-2.364-.015-7.77-.247-7.77-3.805 0-3.543 5.405-3.774 7.77-3.789l.31-.001h.138zm0 1.787c-2.91 0-6.38.348-6.38 2.003 0 1.619 3.263 1.997 6.114 2.018l.266.001c2.91 0 6.379-.346 6.379-1.998 0-1.673-3.469-2.024-6.38-2.024zm9.742-2.27c2.967.432 3.59 1.787 3.59 2.849 0 .648-.261 1.83-2.013 2.48a.953.953 0 01-.327.058.919.919 0 01-.858-.575.886.886 0 01.531-1.153c.83-.307.83-.647.83-.81 0-.522-.682-.886-2.027-1.082a.9.9 0 01-.772-1.017c.074-.488.54-.814 1.046-.75zm-18.439.75a.9.9 0 01-.773 1.017c-1.345.196-2.027.56-2.027 1.082 0 .163 0 .501.832.81a.886.886 0 01.531 1.153.92.92 0 01-.858.575.953.953 0 01-.327-.058C.262 16.6 0 15.418 0 14.77c0-1.06.623-2.417 3.592-2.85.506-.061.97.263 1.045.751zM13.334 0c3.086 0 5.596 2.442 5.596 5.442 0 3.001-2.51 5.443-5.596 5.443H13.3a5.616 5.616 0 01-3.943-1.603A5.308 5.308 0 017.74 5.439C7.739 2.442 10.249 0 13.334 0zm0 1.787c-2.072 0-3.758 1.64-3.758 3.655-.003.977.381 1.89 1.085 2.58a3.772 3.772 0 002.642 1.076l.03.894v-.894c2.073 0 3.76-1.639 3.76-3.656 0-2.015-1.687-3.655-3.76-3.655zm7.58-.62c2.153.344 3.717 2.136 3.717 4.26-.004 2.138-1.647 3.972-3.82 4.269a.911.911 0 01-1.036-.761.897.897 0 01.782-1.01c1.273-.173 2.235-1.248 2.237-2.501 0-1.242-.916-2.293-2.179-2.494a.897.897 0 01-.756-1.027.917.917 0 011.055-.736zM6.81 1.903a.897.897 0 01-.757 1.027C4.79 3.13 3.874 4.182 3.874 5.426c.002 1.251.963 2.327 2.236 2.5.503.067.853.519.783 1.008a.912.912 0 01-1.036.762c-2.175-.297-3.816-2.131-3.82-4.267 0-2.126 1.563-3.918 3.717-4.262.515-.079.972.251 1.055.736z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </li>
                    <li className="_mobile_navigation_bottom_item">
                      <a href="#" className="_mobile_navigation_bottom_link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="27" fill="none" viewBox="0 0 25 27">
                          <path className="_dark_svg" fill="#000" fillOpacity=".6" fillRule="evenodd" d="M10.17 23.46c.671.709 1.534 1.098 2.43 1.098.9 0 1.767-.39 2.44-1.099.36-.377.976-.407 1.374-.067.4.34.432.923.073 1.3-1.049 1.101-2.428 1.708-3.886 1.708h-.003c-1.454-.001-2.831-.608-3.875-1.71a.885.885 0 01.072-1.298 1.01 1.01 0 011.374.068zM12.663 0c5.768 0 9.642 4.251 9.642 8.22 0 2.043.549 2.909 1.131 3.827.576.906 1.229 1.935 1.229 3.88-.453 4.97-5.935 5.375-12.002 5.375-6.067 0-11.55-.405-11.998-5.296-.004-2.024.649-3.053 1.225-3.959l.203-.324c.501-.814.928-1.7.928-3.502C3.022 4.25 6.897 0 12.664 0zm0 1.842C8.13 1.842 4.97 5.204 4.97 8.22c0 2.553-.75 3.733-1.41 4.774-.531.836-.95 1.497-.95 2.932.216 2.316 1.831 3.533 10.055 3.533 8.178 0 9.844-1.271 10.06-3.613-.004-1.355-.423-2.016-.954-2.852-.662-1.041-1.41-2.221-1.41-4.774 0-3.017-3.161-6.38-7.696-6.38z" clipRule="evenodd" />
                        </svg>
                        <span className="_counting">6</span>
                      </a>
                    </li>
                    <li className="_mobile_navigation_bottom_item">
                      <a href="chat.html" className="_mobile_navigation_bottom_link">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                          <path className="_dark_svg" fill="#000" fillOpacity=".6" fillRule="evenodd" d="M12.002 0c3.208 0 6.223 1.239 8.487 3.489 4.681 4.648 4.681 12.211 0 16.86-2.294 2.28-5.384 3.486-8.514 3.486-1.706 0-3.423-.358-5.03-1.097-.474-.188-.917-.366-1.235-.366-.366.003-.859.171-1.335.334-.976.333-2.19.748-3.09-.142-.895-.89-.482-2.093-.149-3.061.164-.477.333-.97.333-1.342 0-.306-.149-.697-.376-1.259C-1 12.417-.032 7.011 3.516 3.49A11.96 11.96 0 0112.002 0zm.001 1.663a10.293 10.293 0 00-7.304 3.003A10.253 10.253 0 002.63 16.244c.261.642.514 1.267.514 1.917 0 .649-.225 1.302-.422 1.878-.163.475-.41 1.191-.252 1.349.156.16.881-.092 1.36-.255.576-.195 1.228-.42 1.874-.424.648 0 1.259.244 1.905.503 3.96 1.818 8.645.99 11.697-2.039 4.026-4 4.026-10.509 0-14.508a10.294 10.294 0 00-7.303-3.002z" clipRule="evenodd" />
                        </svg>
                        <span className="_counting">2</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Layout ── */}
        <div className="container _custom_container">
          <div className="_layout_inner_wrap">
            <div className="row">

              {/* ── Left Sidebar ── */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_left_sidebar_wrap">

                  {/* Explore */}
                  <div className="_layout_left_sidebar_inner">
                    <div className="_left_inner_area_explore _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <h4 className="_left_inner_area_explore_title _title5 _mar_b24">Explore</h4>
                      <ul className="_left_inner_area_explore_list">
                        <li className="_left_inner_area_explore_item _explore_item">
                          <a href="#" className="_left_inner_area_explore_link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#666" d="M10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0zm0 1.395a8.605 8.605 0 100 17.21 8.605 8.605 0 000-17.21zm-1.233 4.65l.104.01c.188.028.443.113.668.203 1.026.398 3.033 1.746 3.8 2.563l.223.239.08.092a1.16 1.16 0 01.025 1.405c-.04.053-.086.105-.19.215l-.269.28c-.812.794-2.57 1.971-3.569 2.391-.277.117-.675.25-.865.253a1.167 1.167 0 01-1.07-.629c-.053-.104-.12-.353-.171-.586l-.051-.262c-.093-.57-.143-1.437-.142-2.347l.001-.288c.01-.858.063-1.64.157-2.147.037-.207.12-.563.167-.678.104-.25.291-.45.523-.575a1.15 1.15 0 01.58-.14zm.14 1.467l-.027.126-.034.198c-.07.483-.112 1.233-.111 2.036l.001.279c.009.737.053 1.414.123 1.841l.048.235.192-.07c.883-.372 2.636-1.56 3.23-2.2l.08-.087-.212-.218c-.711-.682-2.38-1.79-3.167-2.095l-.124-.045z" /></svg>
                            Learning
                          </a>
                          <span className="_left_inner_area_explore_link_txt">New</span>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a href="#" className="_left_inner_area_explore_link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24"><path fill="#666" d="M14.96 2c3.101 0 5.159 2.417 5.159 5.893v8.214c0 3.476-2.058 5.893-5.16 5.893H6.989c-3.101 0-5.159-2.417-5.159-5.893V7.893C1.83 4.42 3.892 2 6.988 2h7.972zm0 1.395H6.988c-2.37 0-3.883 1.774-3.883 4.498v8.214c0 2.727 1.507 4.498 3.883 4.498h7.972c2.375 0 3.883-1.77 3.883-4.498V7.893c0-2.727-1.508-4.498-3.883-4.498zM7.036 9.63c.323 0 .59.263.633.604l.005.094v6.382c0 .385-.285.697-.638.697-.323 0-.59-.262-.632-.603l-.006-.094v-6.382c0-.385.286-.697.638-.697zm3.97-3.053c.323 0 .59.262.632.603l.006.095v9.435c0 .385-.285.697-.638.697-.323 0-.59-.262-.632-.603l-.006-.094V7.274c0-.386.286-.698.638-.698zm3.905 6.426c.323 0 .59.262.632.603l.006.094v3.01c0 .385-.285.697-.638.697-.323 0-.59-.262-.632-.603l-.006-.094v-3.01c0-.385.286-.697.638-.697z" /></svg>
                            Insights
                          </a>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a href="find-friends.html" className="_left_inner_area_explore_link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24"><path fill="#666" d="M9.032 14.456l.297.002c4.404.041 6.907 1.03 6.907 3.678 0 2.586-2.383 3.573-6.615 3.654l-.589.005c-4.588 0-7.203-.972-7.203-3.68 0-2.704 2.604-3.659 7.203-3.659zm0 1.5l-.308.002c-3.645.038-5.523.764-5.523 2.157 0 1.44 1.99 2.18 5.831 2.18 3.847 0 5.832-.728 5.832-2.159 0-1.44-1.99-2.18-5.832-2.18zm8.53-8.037c.347 0 .634.282.679.648l.006.102v1.255h1.185c.38 0 .686.336.686.75 0 .38-.258.694-.593.743l-.093.007h-1.185v1.255c0 .414-.307.75-.686.75-.347 0-.634-.282-.68-.648l-.005-.102-.001-1.255h-1.183c-.379 0-.686-.336-.686-.75 0-.38.258-.694.593-.743l.093-.007h1.183V8.669c0-.414.308-.75.686-.75zM9.031 2c2.698 0 4.864 2.369 4.864 5.319 0 2.95-2.166 5.318-4.864 5.318-2.697 0-4.863-2.369-4.863-5.318C4.17 4.368 6.335 2 9.032 2zm0 1.5c-1.94 0-3.491 1.697-3.491 3.819 0 2.12 1.552 3.818 3.491 3.818 1.94 0 3.492-1.697 3.492-3.818 0-2.122-1.551-3.818-3.492-3.818z" /></svg>
                            Find friends
                          </a>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a href="#" className="_left_inner_area_explore_link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24"><path fill="#666" d="M13.704 2c2.8 0 4.585 1.435 4.585 4.258V20.33c0 .443-.157.867-.436 1.18-.279.313-.658.489-1.063.489a1.456 1.456 0 01-.708-.203l-5.132-3.134-5.112 3.14c-.615.36-1.361.194-1.829-.405l-.09-.126-.085-.155a1.913 1.913 0 01-.176-.786V6.434C3.658 3.5 5.404 2 8.243 2h5.46zm0 1.448h-5.46c-2.191 0-3.295.948-3.295 2.986V20.32c0 .044.01.088 0 .07l.034.063c.059.09.17.12.247.074l5.11-3.138c.38-.23.84-.23 1.222.001l5.124 3.128a.252.252 0 00.114.035.188.188 0 00.14-.064.236.236 0 00.058-.157V6.258c0-1.9-1.132-2.81-3.294-2.81zm.386 4.869c.357 0 .646.324.646.723 0 .367-.243.67-.559.718l-.087.006H7.81c-.357 0-.646-.324-.646-.723 0-.367.243-.67.558-.718l.088-.006h6.28z" /></svg>
                            Bookmarks
                          </a>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a href="group.html" className="_left_inner_area_explore_link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            Group
                          </a>
                        </li>
                        <li className="_left_inner_area_explore_item _explore_item">
                          <a href="#" className="_left_inner_area_explore_link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24"><path fill="#666" d="M7.625 2c.315-.015.642.306.645.69.003.309.234.558.515.558h.928c1.317 0 2.402 1.169 2.419 2.616v.24h2.604c2.911-.026 5.255 2.337 5.377 5.414.005.12.006.245.004.368v4.31c.062 3.108-2.21 5.704-5.064 5.773-.117.003-.228 0-.34-.005a199.325 199.325 0 01-7.516 0c-2.816.132-5.238-2.292-5.363-5.411a6.262 6.262 0 01-.004-.371V11.87c-.03-1.497.48-2.931 1.438-4.024.956-1.094 2.245-1.714 3.629-1.746a3.28 3.28 0 01.342.005l3.617-.001v-.231c-.008-.676-.522-1.23-1.147-1.23h-.93c-.973 0-1.774-.866-1.785-1.937-.003-.386.28-.701.631-.705zm-.614 5.494h-.084C5.88 7.52 4.91 7.987 4.19 8.812c-.723.823-1.107 1.904-1.084 3.045v4.34c-.002.108 0 .202.003.294.094 2.353 1.903 4.193 4.07 4.08 2.487.046 5.013.046 7.55-.001.124.006.212.007.3.004 2.147-.05 3.86-2.007 3.812-4.361V11.87a5.027 5.027 0 00-.002-.291c-.093-2.338-1.82-4.082-4.029-4.082l-.07.002H7.209a4.032 4.032 0 00-.281-.004l.084-.001zm1.292 4.091c.341 0 .623.273.667.626l.007.098-.001 1.016h.946c.372 0 .673.325.673.725 0 .366-.253.669-.582.717l-.091.006h-.946v1.017c0 .4-.3.724-.673.724-.34 0-.622-.273-.667-.626l-.006-.098v-1.017h-.945c-.372 0-.674-.324-.674-.723 0-.367.254-.67.582-.718l.092-.006h.945v-1.017c0-.4.301-.724.673-.724zm7.058 3.428c.372 0 .674.324.674.724 0 .366-.254.67-.582.717l-.091.007h-.09c-.373 0-.674-.324-.674-.724 0-.367.253-.67.582-.717l.091-.007h.09zm-1.536-3.322c.372 0 .673.324.673.724 0 .367-.253.67-.582.718l-.091.006h-.09c-.372 0-.674-.324-.674-.724 0-.366.254-.67.582-.717l.092-.007h.09z" /></svg>
                            Gaming
                          </a>
                          <span className="_left_inner_area_explore_link_txt">New</span>
                        </li>
                        <li className="_left_inner_area_explore_item">
                          <a href="#" className="_left_inner_area_explore_link">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                            Save post
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Suggested People */}
                  <div className="_layout_left_sidebar_inner">
                    <div className="_left_inner_area_suggest _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <div className="_left_inner_area_suggest_content _mar_b24">
                        <h4 className="_left_inner_area_suggest_content_title _title5">Suggested People</h4>
                        <span className="_left_inner_area_suggest_content_txt">
                          <a className="_left_inner_area_suggest_content_txt_link" href="#">See All</a>
                        </span>
                      </div>
                      {[
                        { name: 'Steve Jobs', role: 'CEO of Apple', img: '/assets/images/people1.png' },
                        { name: 'Ryan Roslansky', role: 'CEO of Linkedin', img: '/assets/images/people2.png' },
                        { name: 'Dylan Field', role: 'CEO of Figma', img: '/assets/images/people3.png' },
                      ].map((person) => (
                        <div key={person.name} className="_left_inner_area_suggest_info">
                          <div className="_left_inner_area_suggest_info_box">
                            <div className="_left_inner_area_suggest_info_image">
                              <a href="profile.html"><img src={person.img} alt="Image" className="_info_img" /></a>
                            </div>
                            <div className="_left_inner_area_suggest_info_txt">
                              <a href="profile.html"><h4 className="_left_inner_area_suggest_info_title">{person.name}</h4></a>
                              <p className="_left_inner_area_suggest_info_para">{person.role}</p>
                            </div>
                          </div>
                          <div className="_left_inner_area_suggest_info_link">
                            <a href="#" className="_info_link">Connect</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Events */}
                  <div className="_layout_left_sidebar_inner">
                    <div className="_left_inner_area_event _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <div className="_left_inner_event_content">
                        <h4 className="_left_inner_event_title _title5">Events</h4>
                        <a href="event.html" className="_left_inner_event_link">See all</a>
                      </div>
                      {[1, 2].map((i) => (
                        <a key={i} className="_left_inner_event_card_link" href="event-single.html">
                          <div className="_left_inner_event_card">
                            <div className="_left_inner_event_card_iamge">
                              <img src="/assets/images/feed_event1.png" alt="Image" className="_card_img" />
                            </div>
                            <div className="_left_inner_event_card_content">
                              <div className="_left_inner_card_date">
                                <p className="_left_inner_card_date_para">10</p>
                                <p className="_left_inner_card_date_para1">Jul</p>
                              </div>
                              <div className="_left_inner_card_txt">
                                <h4 className="_left_inner_event_card_title">No more terrorism no more cry</h4>
                              </div>
                            </div>
                            <hr className="_underline" />
                            <div className="_left_inner_event_bottom">
                              <p className="_left_iner_event_bottom">17 People Going</p>
                              <a href="#" className="_left_iner_event_bottom_link">Going</a>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
              {/* ── End Left Sidebar ── */}

              {/* ── Middle Feed ── */}
              <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                <div className="_layout_middle_wrap">
                  <div className="_layout_middle_inner">

                    {/* Stories – Desktop */}
                    <div className="_feed_inner_ppl_card _mar_b16">
                      <div className="_feed_inner_story_arrow">
                        <button type="button" className="_feed_inner_story_arrow_btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none" viewBox="0 0 9 8">
                            <path fill="#fff" d="M8 4l.366-.341.318.341-.318.341L8 4zm-7 .5a.5.5 0 010-1v1zM5.566.659l2.8 3-.732.682-2.8-3L5.566.66zm2.8 3.682l-2.8 3-.732-.682 2.8-3 .732.682zM8 4.5H1v-1h7v1z" />
                          </svg>
                        </button>
                      </div>
                      <div className="row">
                        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col">
                          <div className="_feed_inner_profile_story _b_radious6">
                            <div className="_feed_inner_profile_story_image">
                              <img src="/assets/images/card_ppl1.png" alt="Image" className="_profile_story_img" />
                              <div className="_feed_inner_story_txt">
                                <div className="_feed_inner_story_btn">
                                  <button className="_feed_inner_story_btn_link">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10">
                                      <path stroke="#fff" strokeLinecap="round" d="M.5 4.884h9M4.884 9.5v-9" />
                                    </svg>
                                  </button>
                                </div>
                                <p className="_feed_inner_story_para">Your Story</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {[
                          { img: '/assets/images/card_ppl2.png', name: 'Ryan Roslansky' },
                          { img: '/assets/images/card_ppl3.png', name: 'Ryan Roslansky' },
                          { img: '/assets/images/card_ppl4.png', name: 'Ryan Roslansky' },
                        ].map((story, idx) => (
                          <div key={idx} className={`col-xl-3 col-lg-3 col-md-4 col-sm-4${idx === 1 ? ' _custom_mobile_none' : idx === 2 ? ' _custom_none' : ''}`}>
                            <div className="_feed_inner_public_story _b_radious6">
                              <div className="_feed_inner_public_story_image">
                                <img src={story.img} alt="Image" className="_public_story_img" />
                                <div className="_feed_inner_pulic_story_txt">
                                  <p className="_feed_inner_pulic_story_para">{story.name}</p>
                                </div>
                                <div className="_feed_inner_public_mini">
                                  <img src="/assets/images/mini_pic.png" alt="Image" className="_public_mini_img" />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stories – Mobile */}
                    <div className="_feed_inner_ppl_card_mobile _mar_b16">
                      <div className="_feed_inner_ppl_card_area">
                        <ul className="_feed_inner_ppl_card_area_list">
                          <li className="_feed_inner_ppl_card_area_item">
                            <a href="#" className="_feed_inner_ppl_card_area_link">
                              <div className="_feed_inner_ppl_card_area_story">
                                <img src="/assets/images/mobile_story_img.png" alt="Image" className="_card_story_img" />
                                <div className="_feed_inner_ppl_btn">
                                  <button className="_feed_inner_ppl_btn_link" type="button">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 12 12">
                                      <path stroke="#fff" strokeLinecap="round" strokeLinejoin="round" d="M6 2.5v7M2.5 6h7" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <p className="_feed_inner_ppl_card_area_link_txt">Your Story</p>
                            </a>
                          </li>
                          {[
                            { img: '/assets/images/mobile_story_img1.png', active: true },
                            { img: '/assets/images/mobile_story_img2.png', active: false },
                            { img: '/assets/images/mobile_story_img1.png', active: true },
                            { img: '/assets/images/mobile_story_img2.png', active: false },
                          ].map((s, i) => (
                            <li key={i} className="_feed_inner_ppl_card_area_item">
                              <a href="#" className="_feed_inner_ppl_card_area_link">
                                <div className={s.active ? '_feed_inner_ppl_card_area_story_active' : '_feed_inner_ppl_card_area_story_inactive'}>
                                  <img src={s.img} alt="Image" className="_card_story_img1" />
                                </div>
                                <p className="_feed_inner_ppl_card_area_txt">Ryan...</p>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Create Post */}
                    <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
                      <div className="_feed_inner_text_area_box">
                        <div className="_feed_inner_text_area_box_image">
                          <img src="/assets/images/txt_img.png" alt="Image" className="_txt_img" />
                        </div>
                        <div className="form-floating _feed_inner_text_area_box_form">
                          <textarea
                            className="form-control _textarea"
                            placeholder="Write something ..."
                            id="floatingTextarea"
                            value={newPost.content}
                            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                          />
                          <label className="_feed_textarea_label" htmlFor="floatingTextarea">
                            Write something ...
                            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" fill="none" viewBox="0 0 23 24"><path fill="#666" d="M19.504 19.209c.332 0 .601.289.601.646 0 .326-.226.596-.52.64l-.081.005h-6.276c-.332 0-.602-.289-.602-.645 0-.327.227-.597.52-.64l.082-.006h6.276zM13.4 4.417c1.139-1.223 2.986-1.223 4.125 0l1.182 1.268c1.14 1.223 1.14 3.205 0 4.427L9.82 19.649a2.619 2.619 0 01-1.916.85h-3.64c-.337 0-.61-.298-.6-.66l.09-3.941a3.019 3.019 0 01.794-1.982l8.852-9.5zm-.688 2.562l-7.313 7.85a1.68 1.68 0 00-.441 1.101l-.077 3.278h3.023c.356 0 .698-.133.968-.376l.098-.096 7.35-7.887-3.608-3.87zm3.962-1.65a1.633 1.633 0 00-2.423 0l-.688.737 3.606 3.87.688-.737c.631-.678.666-1.755.105-2.477l-.105-.124-1.183-1.268z" /></svg>
                          </label>
                        </div>
                      </div>
                      <div className="_feed_inner_text_area_bottom">
                        <div className="_feed_inner_text_area_item">
                          <div className="_feed_inner_text_area_bottom_photo _feed_common">
                            <button type="button" className="_feed_inner_text_area_bottom_photo_link">
                              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#666" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z" /></svg>
                              </span>
                              Photo
                            </button>
                          </div>
                          <div className="_feed_inner_text_area_bottom_video _feed_common">
                            <button type="button" className="_feed_inner_text_area_bottom_photo_link">
                              <input type="file" accept="image/*" style={{ display: 'none' }} id="imageUpload" onChange={(e) => setNewPost({ ...newPost, image: e.target.files[0] })} />
                              <label htmlFor="imageUpload" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24"><path fill="#666" d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688zM18.4 8.57l-.062.02-2.921 1.306v4.596l2.921 1.307c.165.073.343-.036.38-.215l.008-.07V8.876c0-.195-.16-.334-.326-.305z" /></svg>
                                </span>
                                Video
                              </label>
                            </button>
                          </div>
                          <div className="_feed_inner_text_area_bottom_event _feed_common">
                            <button type="button" className="_feed_inner_text_area_bottom_photo_link">
                              <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22"><path fill="#666" d="M14.273 0c3.134 0 5.223 2.159 5.223 5.393v11.214C19.496 19.841 17.407 22 14.273 22H5.723C2.587 22 .498 19.841.498 16.607V5.393C.498 2.16 2.595 0 5.723 0h8.55zm0 1.5H5.723C3.43 1.5 1.998 3.01 1.998 5.393v11.214c0 2.383 1.432 3.893 3.725 3.893h8.55c2.292 0 3.723-1.51 3.723-3.893V5.393c0-2.376-1.435-3.893-3.723-3.893zM6.624 14.5a1 1 0 110 2 1 1 0 010-2zm3.875 0a1 1 0 110 2 1 1 0 010-2zM6.624 10a1 1 0 110 2 1 1 0 010-2zm3.875 0a1 1 0 110 2 1 1 0 010-2zm3.875 0a1 1 0 110 2 1 1 0 010-2zM7.124 1.5v3a.75.75 0 01-1.5 0v-3a.75.75 0 011.5 0zm6.5 0v3a.75.75 0 01-1.5 0v-3a.75.75 0 011.5 0z" /></svg>
                              </span>
                              Event
                            </button>
                          </div>
                          <div className="_feed_inner_text_area_bottom_feeling _feed_common">
                            <select value={newPost.privacy} onChange={(e) => setNewPost({ ...newPost, privacy: e.target.value })} style={{ border: 'none', background: 'transparent' }}>
                              <option value="public">Public</option>
                              <option value="private">Private</option>
                            </select>
                          </div>
                        </div>
                        <div className="_feed_inner_text_area_btn">
                          <button type="button" onClick={handleCreatePost} className="_feed_inner_text_area_btn_link">
                            <svg className="_mar_img" xmlns="http://www.w3.org/2000/svg" width="14" height="13" fill="none" viewBox="0 0 14 13"><path fill="#fff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88zM9.097 13c-.464 0-.89-.236-1.14-.641L5.372 8.165l-4.237-2.65a1.336 1.336 0 01-.622-1.331c.074-.536.441-.96.957-1.112L11.774.054a1.347 1.347 0 011.67 1.682l-3.05 10.296A1.332 1.332 0 019.098 13z" clipRule="evenodd" /></svg>
                            <span>Post</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Posts List */}
                    {posts.map((post) => (
                      <div key={post.id} className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
                        <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                          <div className="_feed_inner_timeline_post_top">
                            <div className="_feed_inner_timeline_post_box">
                              <div className="_feed_inner_timeline_post_box_image">
                                <img src="/assets/images/post_img.png" alt="" className="_post_img" />
                              </div>
                              <div className="_feed_inner_timeline_post_box_txt">
                                <h4 className="_feed_inner_timeline_post_box_title">{post.author.first_name} {post.author.last_name}</h4>
                                <p className="_feed_inner_timeline_post_box_para">
                                  {formatDistanceToNow(new Date(post.created_at))} ago .{' '}
                                  <a href="#">{post.privacy}</a>
                                </p>
                              </div>
                            </div>
                            <div className="_feed_inner_timeline_post_box_dropdown">
                              <div className="_feed_timeline_post_dropdown">
                                <button onClick={() => setShowDropdown(showDropdown === post.id ? null : post.id)} className="_feed_timeline_post_dropdown_link">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                                    <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                                  </svg>
                                </button>
                              </div>
                              {showDropdown === post.id && (
                                <div className="_feed_timeline_dropdown">
                                  <ul className="_feed_timeline_dropdown_list">
                                    <li className="_feed_timeline_dropdown_item">
                                      <a href="#" className="_feed_timeline_dropdown_link">
                                        <span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z" /></svg>
                                        </span>
                                        Save Post
                                      </a>
                                    </li>
                                    <li className="_feed_timeline_dropdown_item">
                                      <a href="#" className="_feed_timeline_dropdown_link">
                                        <span>
                                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5" /></svg>
                                        </span>
                                        Hide
                                      </a>
                                    </li>
                                    {post.author.id === user?.id && (
                                      <>
                                        <li className="_feed_timeline_dropdown_item">
                                          <button onClick={() => { setEditingPost(post.id); setEditContent(post.content); setShowDropdown(null); }} className="_feed_timeline_dropdown_link" style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left' }}>
                                            <span>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z" /></svg>
                                            </span>
                                            Edit Post
                                          </button>
                                        </li>
                                        <li className="_feed_timeline_dropdown_item">
                                          <button onClick={() => handleDeletePost(post.id)} className="_feed_timeline_dropdown_link" style={{ border: 'none', background: 'transparent', width: '100%', textAlign: 'left' }}>
                                            <span>
                                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18"><path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5" /></svg>
                                            </span>
                                            Delete Post
                                          </button>
                                        </li>
                                      </>
                                    )}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>

                          {editingPost === post.id ? (
                            <div style={{ marginBottom: '15px' }}>
                              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="form-control" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
                              <button onClick={() => handleEditPost(post.id)} className="_btn1" style={{ padding: '8px 16px', width: 'auto', marginRight: '10px' }}>Save</button>
                              <button onClick={() => setEditingPost(null)} className="_btn1" style={{ padding: '8px 16px', width: 'auto', background: '#666' }}>Cancel</button>
                            </div>
                          ) : (
                            <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
                          )}

                          {post.image && (
                            <div className="_feed_inner_timeline_image">
                              <img src={`http://localhost:8000${post.image}`} alt="" className="_time_img" />
                            </div>
                          )}
                        </div>

                        {/* Reaction Counts */}
                        <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                          <div className="_feed_inner_timeline_total_reacts_image">
                            <img src="/assets/images/react_img1.png" alt="Image" className="_react_img1" />
                            <img src="/assets/images/react_img2.png" alt="Image" className="_react_img" />
                            <img src="/assets/images/react_img3.png" alt="Image" className="_react_img _rect_img_mbl_none" />
                            <img src="/assets/images/react_img4.png" alt="Image" className="_react_img _rect_img_mbl_none" />
                            <img src="/assets/images/react_img5.png" alt="Image" className="_react_img _rect_img_mbl_none" />
                            <p className="_feed_inner_timeline_total_reacts_para">{post.likes_count}</p>
                          </div>
                          <div className="_feed_inner_timeline_total_reacts_txt">
                            <p className="_feed_inner_timeline_total_reacts_para1"><span>{post.comments_count}</span> Comment</p>
                          </div>
                        </div>

                        {/* Reaction Buttons */}
                        <div className="_feed_inner_timeline_reaction _padd_r24 _padd_l24">
                          <button onClick={() => handleLike(post.id)} className={`_feed_inner_timeline_reaction_emoji _feed_reaction${post.user_has_liked ? ' _feed_reaction_active' : ''}`}>
                            <span className="_feed_inner_timeline_reaction_link">
                              <span>
                                <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={post.user_has_liked ? '#e0245e' : 'none'} stroke={post.user_has_liked ? '#e0245e' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                </svg>
                                Like
                              </span>
                            </span>
                          </button>
                          <button className="_feed_inner_timeline_reaction_comment _feed_reaction">
                            <span className="_feed_inner_timeline_reaction_link">
                              <span>
                                <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                                  <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                                  <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
                                </svg>
                                Comment
                              </span>
                            </span>
                          </button>
                          <button className="_feed_inner_timeline_reaction_share _feed_reaction">
                            <span className="_feed_inner_timeline_reaction_link">
                              <span>
                                <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                                  <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
                                </svg>
                                Share
                              </span>
                            </span>
                          </button>
                        </div>

                        {/* Comments */}
                        <div className="_timline_comment_main _padd_r24 _padd_l24">
                          {/* Previous comments */}
                          {post.comments?.length > 3 && (
                            <div className="_previous_comment">
                              <button type="button" className="_previous_comment_txt">View {post.comments.length - 3} previous comments</button>
                            </div>
                          )}

                          {post.comments?.slice(0, 3).map((comment) => (
                            <div key={comment.id} className="_comment_main">
                              <div className="_comment_image">
                                <a href="profile.html" className="_comment_image_link">
                                  <img src="/assets/images/txt_img.png" alt="" className="_comment_img1" />
                                </a>
                              </div>
                              <div className="_comment_area">
                                <div className="_comment_details">
                                  <div className="_comment_details_top">
                                    <div className="_comment_name">
                                      <a href="profile.html">
                                        <h4 className="_comment_name_title">{comment.author.first_name} {comment.author.last_name}</h4>
                                      </a>
                                    </div>
                                  </div>
                                  <div className="_comment_status">
                                    <p className="_comment_status_text"><span>{comment.content}</span></p>
                                  </div>
                                  <div className="_total_reactions">
                                    <div className="_total_react">
                                      <span className="_reaction_like">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                                      </span>
                                      <span className="_reaction_heart">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                                      </span>
                                    </div>
                                    <span className="_total">{comment.likes_count}</span>
                                  </div>
                                  <div className="_comment_reply">
                                    <div className="_comment_reply_num">
                                      <ul className="_comment_reply_list">
                                        <li><span onClick={() => handleCommentLike(comment.id)} style={{ cursor: 'pointer' }}>Like.</span></li>
                                        <li><span onClick={() => {
                                          const el = document.getElementById(`reply-input-${comment.id}`);
                                          if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
                                        }} style={{ cursor: 'pointer' }}>Reply.</span></li>
                                        <li><span>Share</span></li>
                                        <li><span className="_time_link">.{formatDistanceToNow(new Date(comment.created_at))}</span></li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>

                                {/* Replies */}
                                {comment.replies?.map((reply) => (
                                  <div key={reply.id} className="_comment_main" style={{ marginLeft: '40px', marginTop: '10px' }}>
                                    <div className="_comment_image">
                                      <img src="/assets/images/comment_img.png" alt="" className="_comment_img1" style={{ width: '30px' }} />
                                    </div>
                                    <div className="_comment_area">
                                      <div className="_comment_details">
                                        <div className="_comment_name">
                                          <h4 className="_comment_name_title">{reply.author.first_name} {reply.author.last_name}</h4>
                                        </div>
                                        <div className="_comment_status">
                                          <p className="_comment_status_text">{reply.content}</p>
                                        </div>
                                        <div className="_comment_reply">
                                          <div className="_comment_reply_num">
                                            <ul className="_comment_reply_list">
                                              <li><span onClick={() => handleReplyLike(reply.id)} style={{ cursor: 'pointer' }}>Like.</span></li>
                                              <li><span className="_time_link">.{formatDistanceToNow(new Date(reply.created_at))}</span></li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                {/* Reply input box */}
                                <div id={`reply-input-${comment.id}`} className="_feed_inner_comment_box" style={{ display: 'none', marginTop: '10px' }}>
                                  <form className="_feed_inner_comment_box_form">
                                    <div className="_feed_inner_comment_box_content">
                                      <div className="_feed_inner_comment_box_content_image">
                                        <img src="/assets/images/comment_img.png" alt="" className="_comment_img" />
                                      </div>
                                      <div className="_feed_inner_comment_box_content_txt">
                                        <textarea className="form-control _comment_textarea" placeholder="Write a reply" value={replyInputs[comment.id] || ''} onChange={(e) => setReplyInputs({ ...replyInputs, [comment.id]: e.target.value })} />
                                      </div>
                                    </div>
                                    <div className="_feed_inner_comment_box_icon">
                                      <button type="button" onClick={() => handleReply(comment.id)} className="_feed_inner_comment_box_icon_btn">Reply</button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Add Comment */}
                          <div className="_feed_inner_comment_box">
                            <form className="_feed_inner_comment_box_form">
                              <div className="_feed_inner_comment_box_content">
                                <div className="_feed_inner_comment_box_content_image">
                                  <img src="/assets/images/comment_img.png" alt="" className="_comment_img" />
                                </div>
                                <div className="_feed_inner_comment_box_content_txt">
                                  <textarea
                                    className="form-control _comment_textarea"
                                    placeholder="Write a comment"
                                    id="floatingTextarea2"
                                    value={commentInputs[post.id] || ''}
                                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div className="_feed_inner_comment_box_icon">
                                <button className="_feed_inner_comment_box_icon_btn">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M13.167 6.534a.5.5 0 01.5.5c0 3.061-2.35 5.582-5.333 5.837V14.5a.5.5 0 01-1 0v-1.629C4.35 12.616 2 10.096 2 7.034a.5.5 0 011 0c0 2.679 2.168 4.859 4.833 4.859 2.666 0 4.834-2.18 4.834-4.86a.5.5 0 01.5-.5zM7.833.667a3.218 3.218 0 013.208 3.22v3.126c0 1.775-1.439 3.22-3.208 3.22a3.218 3.218 0 01-3.208-3.22V3.887c0-1.776 1.44-3.22 3.208-3.22zm0 1a2.217 2.217 0 00-2.208 2.22v3.126c0 1.223.991 2.22 2.208 2.22a2.217 2.217 0 002.208-2.22V3.887c0-1.224-.99-2.22-2.208-2.22z" clipRule="evenodd" /></svg>
                                </button>
                                <button className="_feed_inner_comment_box_icon_btn">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 16 16"><path fill="#000" fillOpacity=".46" fillRule="evenodd" d="M10.867 1.333c2.257 0 3.774 1.581 3.774 3.933v5.435c0 2.352-1.517 3.932-3.774 3.932H5.101c-2.254 0-3.767-1.58-3.767-3.932V5.266c0-2.352 1.513-3.933 3.767-3.933h5.766zm0 1H5.101c-1.681 0-2.767 1.152-2.767 2.933v5.435c0 1.782 1.086 2.932 2.767 2.932h5.766c1.685 0 2.774-1.15 2.774-2.932V5.266c0-1.781-1.089-2.933-2.774-2.933z" clipRule="evenodd" /></svg>
                                </button>
                                <button type="button" onClick={() => handleComment(post.id)} className="_feed_inner_comment_box_icon_btn" style={{ fontSize: '12px', padding: '4px 8px' }}>Post</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              </div>
              {/* ── End Middle Feed ── */}

              {/* ── Right Sidebar ── */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12">
                <div className="_layout_right_sidebar_wrap">

                  {/* You Might Like */}
                  <div className="_layout_right_sidebar_inner">
                    <div className="_right_inner_area_info _padd_t24 _padd_b24 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <div className="_right_inner_area_info_content _mar_b24">
                        <h4 className="_right_inner_area_info_content_title _title5">You Might Like</h4>
                        <span className="_right_inner_area_info_content_txt">
                          <a className="_right_inner_area_info_content_txt_link" href="#">See All</a>
                        </span>
                      </div>
                      <hr className="_underline" />
                      <div className="_right_inner_area_info_ppl">
                        <div className="_right_inner_area_info_box">
                          <div className="_right_inner_area_info_box_image">
                            <a href="profile.html">
                              <img src="/assets/images/Avatar.png" alt="Image" className="_ppl_img" />
                            </a>
                          </div>
                          <div className="_right_inner_area_info_box_txt">
                            <a href="profile.html">
                              <h4 className="_right_inner_area_info_box_title">Radovan SkillArena</h4>
                            </a>
                            <p className="_right_inner_area_info_box_para">Founder & CEO at Trophy</p>
                          </div>
                        </div>
                        <div className="_right_info_btn_grp">
                          <button type="button" className="_right_info_btn_link">Ignore</button>
                          <button type="button" className="_right_info_btn_link _right_info_btn_link_active">Follow</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Your Friends */}
                  <div className="_layout_right_sidebar_inner">
                    <div className="_feed_right_inner_area_card _padd_t24 _padd_b6 _padd_r24 _padd_l24 _b_radious6 _feed_inner_area">
                      <div className="_feed_top_fixed">
                        <div className="_feed_right_inner_area_card_content _mar_b24">
                          <h4 className="_feed_right_inner_area_card_content_title _title5">Your Friends</h4>
                          <span className="_feed_right_inner_area_card_content_txt">
                            <a className="_feed_right_inner_area_card_content_txt_link" href="find-friends.html">See All</a>
                          </span>
                        </div>
                        <form className="_feed_right_inner_area_card_form">
                          <svg className="_feed_right_inner_area_card_form_svg" xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 17 17">
                            <circle cx="7" cy="7" r="6" stroke="#666" />
                            <path stroke="#666" strokeLinecap="round" d="M16 16l-3-3" />
                          </svg>
                          <input className="form-control me-2 _feed_right_inner_area_card_form_inpt" type="search" placeholder="input search text" aria-label="Search" />
                        </form>
                      </div>
                      <div className="_feed_bottom_fixed">
                        {[
                          { name: 'Steve Jobs', role: 'CEO of Apple', img: '/assets/images/people1.png', inactive: true, time: '5 minute ago' },
                          { name: 'Ryan Roslansky', role: 'CEO of Linkedin', img: '/assets/images/people2.png', online: true },
                          { name: 'Dylan Field', role: 'CEO of Figma', img: '/assets/images/people3.png', online: true },
                          { name: 'Dylan Field', role: 'CEO of Figma', img: '/assets/images/people3.png', online: true },
                          { name: 'Steve Jobs', role: 'CEO of Apple', img: '/assets/images/people1.png', inactive: true, time: '5 minute ago' },
                        ].map((friend, i) => (
                          <div key={i} className={`_feed_right_inner_area_card_ppl${friend.inactive ? ' _feed_right_inner_area_card_ppl_inactive' : ''}`}>
                            <div className="_feed_right_inner_area_card_ppl_box">
                              <div className="_feed_right_inner_area_card_ppl_image">
                                <a href="profile.html"><img src={friend.img} alt="" className="_box_ppl_img" /></a>
                              </div>
                              <div className="_feed_right_inner_area_card_ppl_txt">
                                <a href="profile.html"><h4 className="_feed_right_inner_area_card_ppl_title">{friend.name}</h4></a>
                                <p className="_feed_right_inner_area_card_ppl_para">{friend.role}</p>
                              </div>
                            </div>
                            <div className="_feed_right_inner_area_card_ppl_side">
                              {friend.online ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14">
                                  <rect width="12" height="12" x="1" y="1" fill="#0ACF83" stroke="#fff" strokeWidth="2" rx="6" />
                                </svg>
                              ) : (
                                <span>{friend.time}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              {/* ── End Right Sidebar ── */}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;